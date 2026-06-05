'use client';

import React, { useState, useEffect } from 'react';
import { db, auth, isFirebaseConfigured } from '../../services/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { savePortfolioSection } from '../../services/portfolioService';
import { PortfolioData, ExperienceItem } from '../../types/portfolio';
import { portfolio as fallbackPortfolio } from '../../data/portfolio';

export default function AdminPage() {
  // Authentication states
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Editor UI states
  const [activeTab, setActiveTab] = useState<'hero' | 'profile' | 'about' | 'experience' | 'skills' | 'contact'>('hero');
  const [data, setData] = useState<PortfolioData>(JSON.parse(JSON.stringify(fallbackPortfolio)));
  const [savingSection, setSavingSection] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [newSkill, setNewSkill] = useState('');

  // Handle Firebase Auth Session
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch Firestore documents once authenticated
  useEffect(() => {
    if (isFirebaseConfigured && user) {
      const fetchLiveConfig = async () => {
        const sections = ['metadata', 'recruiter', 'hero', 'about', 'experience', 'skills', 'contact'];
        const updatedData: PortfolioData = JSON.parse(JSON.stringify(fallbackPortfolio));
        
        try {
          const promises = sections.map(async (sec) => {
            const docRef = doc(db, 'portfolio', sec);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const docData = docSnap.data();
              mapDocToState(sec, docData, updatedData);
            }
          });
          await Promise.all(promises);
          setData(updatedData);
        } catch (err) {
          console.error("Error loading Firestore documents into form:", err);
        }
      };

      fetchLiveConfig();
    }
  }, [user]);

  const mapDocToState = (section: string, docData: any, target: PortfolioData) => {
    switch (section) {
      case 'metadata':
        target.meta = docData;
        break;
      case 'recruiter':
        target.quickProfile = docData;
        break;
      case 'hero':
        target.hero = docData;
        break;
      case 'about':
        target.sections.about = docData;
        break;
      case 'experience':
        target.sections.experience = docData;
        break;
      case 'skills':
        target.sections.skills = docData;
        break;
      case 'contact':
        target.sections.contact = docData;
        break;
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isFirebaseConfigured) {
      setError("Firebase keys are not configured in your environment variables. Admin authentication is unavailable.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    }
  };

  // Save specific section to Firestore
  const handleSaveSection = async (section: 'metadata' | 'recruiter' | 'hero' | 'about' | 'experience' | 'skills' | 'contact') => {
    setSavingSection(section);
    setNotification({ type: '', message: '' });

    try {
      let docData: any;
      if (section === 'metadata') docData = data.meta;
      else if (section === 'recruiter') docData = data.quickProfile;
      else if (section === 'hero') docData = data.hero;
      else if (section === 'about') docData = data.sections.about;
      else if (section === 'experience') docData = data.sections.experience;
      else if (section === 'skills') docData = data.sections.skills;
      else if (section === 'contact') docData = data.sections.contact;

      await savePortfolioSection(section, docData);
      setNotification({
        type: 'success',
        message: `Successfully saved ${section.toUpperCase()} details directly to Firestore!`
      });
      setTimeout(() => setNotification({ type: '', message: '' }), 5000);
    } catch (err: any) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.message || `Failed to update ${section} details.`
      });
    } finally {
      setSavingSection('');
    }
  };

  // Form helpers
  const updateMeta = (key: string, val: string) => {
    setData((prev) => ({ ...prev, meta: { ...prev.meta, [key]: val } }));
  };

  const updateHero = (key: string, val: string) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, [key]: val } }));
  };

  const updateQuickProfile = (key: string, val: string) => {
    setData((prev) => ({
      ...prev,
      quickProfile: { ...prev.quickProfile, [key]: val }
    }));
  };

  const updateAbout = (key: string, val: string) => {
    setData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        about: { ...prev.sections.about, [key]: val }
      }
    }));
  };

  const updateFact = (idx: number, key: 'value' | 'label', val: string) => {
    setData((prev) => {
      const facts = [...prev.sections.about.facts];
      facts[idx] = { ...facts[idx], [key]: val };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          about: { ...prev.sections.about, facts }
        }
      };
    });
  };

  const addExperienceItem = () => {
    setData((prev) => {
      const items = [...prev.sections.experience.items];
      const newItem: ExperienceItem = {
        company: 'New Company',
        role: 'Visual Designer',
        period: 'Jan 2026 - Present',
        points: ['Engineered key campaign creatives and visual layouts.']
      };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items: [newItem, ...items] }
        }
      };
    });
  };

  const removeExperienceItem = (idx: number) => {
    setData((prev) => {
      const items = prev.sections.experience.items.filter((_, i) => i !== idx);
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const moveExperienceItem = (idx: number, direction: number) => {
    setData((prev) => {
      const items = [...prev.sections.experience.items];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= items.length) return prev;
      const temp = items[idx];
      items[idx] = items[targetIdx];
      items[targetIdx] = temp;
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const updateExperienceItemField = (idx: number, key: 'company' | 'role' | 'period', val: string) => {
    setData((prev) => {
      const items = [...prev.sections.experience.items];
      items[idx] = { ...items[idx], [key]: val };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const updateExperiencePoint = (jobIdx: number, ptIdx: number, val: string) => {
    setData((prev) => {
      const items = [...prev.sections.experience.items];
      const points = [...items[jobIdx].points];
      points[ptIdx] = val;
      items[jobIdx] = { ...items[jobIdx], points };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const addExperiencePoint = (jobIdx: number) => {
    setData((prev) => {
      const items = [...prev.sections.experience.items];
      items[jobIdx] = { ...items[jobIdx], points: [...items[jobIdx].points, ''] };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const removeExperiencePoint = (jobIdx: number, ptIdx: number) => {
    setData((prev) => {
      const items = [...prev.sections.experience.items];
      items[jobIdx] = {
        ...items[jobIdx],
        points: items[jobIdx].points.filter((_, i) => i !== ptIdx)
      };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        skills: {
          ...prev.sections.skills,
          items: [...prev.sections.skills.items, newSkill.trim()]
        }
      }
    }));
    setNewSkill('');
  };

  const removeSkill = (idx: number) => {
    setData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        skills: {
          ...prev.sections.skills,
          items: prev.sections.skills.items.filter((_, i) => i !== idx)
        }
      }
    }));
  };

  const updateContactItem = (idx: number, key: 'value' | 'href', val: string) => {
    setData((prev) => {
      const items = [...prev.sections.contact.items];
      items[idx] = { ...items[idx], [key]: val };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          contact: { ...prev.sections.contact, items }
        }
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#06B6D4] animate-spin"></div>
      </div>
    );
  }

  // LOGIN PAGE (UI)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Neon decorative background blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#06B6D4] opacity-[0.06] blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#8B5CF6] opacity-[0.06] blur-[90px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#11151C]/60 backdrop-blur-md border border-[#06B6D4]/20 p-8 rounded-[32px] shadow-[0_22px_80px_rgba(11,14,20,0.5)] relative z-10">
          <div className="text-center mb-8">
            <span className="inline-block text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-[#06B6D4] mb-2">
              Firebase CMS Setup
            </span>
            <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight">Portfolio Admin</h1>
            <p className="mt-2 text-sm text-[#94A3B8]">Sign in to edit your portfolio live.</p>
          </div>

          {!isFirebaseConfigured && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold leading-relaxed">
              ⚠️ Firebase configuration is missing from environment variables. Please check your `.env.local` setup.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold text-center leading-normal">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3.5 text-sm text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition"
                placeholder="admin@example.com"
                required
                disabled={!isFirebaseConfigured}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3.5 text-sm text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition"
                placeholder="••••••••"
                required
                disabled={!isFirebaseConfigured}
              />
            </div>

            <button
              type="submit"
              disabled={!isFirebaseConfigured}
              className="w-full mt-6 py-3.5 bg-[#06B6D4] hover:bg-[#22d3ee] text-[#0B0E14] font-black text-xs uppercase tracking-widest rounded-xl transition shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD CMS PAGE (UI)
  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#94A3B8] p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#06B6D4]/20 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight">Portfolio Admin Panel</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-emerald-400 animate-pulse" />
                Live Firestore CMS
              </span>
            </div>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Welcome, <span className="text-white font-bold">{user.email}</span>. Changes saved here will update your portfolio website instantly.
            </p>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 border border-red-500/20 hover:border-red-500 hover:bg-red-500/5 text-red-400 font-bold text-xs uppercase tracking-wider rounded-xl transition"
            >
              Logout / Sign Out
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {notification.type === 'success' && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-2xl">
            {notification.message}
          </div>
        )}
        {notification.type === 'error' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-2xl">
            {notification.message}
          </div>
        )}

        {/* Layout Grid: 3 Cols Editor, 2 Cols Real-time Preview */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          
          {/* EDITOR COLUMN */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Sidebar-style Nav Buttons */}
            <div className="flex flex-wrap gap-2 border-b border-[#1E293B] pb-3">
              {[
                { id: 'hero', label: '🚀 Hero' },
                { id: 'profile', label: '💼 Quick Profile' },
                { id: 'about', label: '👤 About' },
                { id: 'experience', label: '⏳ Experience' },
                { id: 'skills', label: '🛠️ Skills & Contact' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition ${
                    activeTab === tab.id
                      ? 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20'
                      : 'hover:bg-[#11151C] text-[#94A3B8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Panel Container */}
            <div className="bg-[#11151C]/60 border border-[#06B6D4]/15 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* TAB 1: HERO & SITE METADATA */}
              {activeTab === 'hero' && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 mb-2">
                    <h2 className="text-xl font-bold text-[#F8FAFC]">Hero & Metadata</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveSection('metadata')}
                        disabled={savingSection === 'metadata'}
                        className="px-3.5 py-1.5 bg-emerald-500 text-[#0B0E14] font-black text-xs uppercase tracking-wider rounded-lg hover:bg-emerald-400 disabled:opacity-40 transition"
                      >
                        {savingSection === 'metadata' ? 'Saving...' : 'Save Meta'}
                      </button>
                      <button
                        onClick={() => handleSaveSection('hero')}
                        disabled={savingSection === 'hero'}
                        className="px-3.5 py-1.5 bg-[#06B6D4] text-[#0B0E14] font-black text-xs uppercase tracking-wider rounded-lg hover:bg-[#22d3ee] disabled:opacity-40 transition"
                      >
                        {savingSection === 'hero' ? 'Saving...' : 'Save Hero'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Website title</label>
                      <input
                        type="text"
                        value={data.meta.title}
                        onChange={(e) => updateMeta('title', e.target.value)}
                        className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Role label</label>
                      <input
                        type="text"
                        value={data.meta.role}
                        onChange={(e) => updateMeta('role', e.target.value)}
                        className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Hero subtitle / Eyebrow</label>
                    <input
                      type="text"
                      value={data.hero.eyebrow}
                      onChange={(e) => updateHero('eyebrow', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Main heading</label>
                    <textarea
                      value={data.hero.heading}
                      onChange={(e) => updateHero('heading', e.target.value)}
                      className="w-full h-24 bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl p-4 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Hero description</label>
                    <textarea
                      value={data.hero.description}
                      onChange={(e) => updateHero('description', e.target.value)}
                      className="w-full h-32 bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl p-4 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition resize-y leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Copyright label</label>
                    <input
                      type="text"
                      value={data.meta.copyright}
                      onChange={(e) => updateMeta('copyright', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: RECRUITER PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 mb-2">
                    <h2 className="text-xl font-bold text-[#F8FAFC]">Recruiter Profile Card</h2>
                    <button
                      onClick={() => handleSaveSection('recruiter')}
                      disabled={savingSection === 'recruiter'}
                      className="px-4 py-2 bg-[#06B6D4] text-[#0B0E14] font-black text-xs uppercase tracking-wider rounded-lg hover:bg-[#22d3ee] disabled:opacity-40 transition"
                    >
                      {savingSection === 'recruiter' ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Role sought</label>
                    <input
                      type="text"
                      value={data.quickProfile?.roleSought || ''}
                      onChange={(e) => updateQuickProfile('roleSought', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Experience level</label>
                    <input
                      type="text"
                      value={data.quickProfile?.experience || ''}
                      onChange={(e) => updateQuickProfile('experience', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Location status</label>
                    <input
                      type="text"
                      value={data.quickProfile?.location || ''}
                      onChange={(e) => updateQuickProfile('location', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Key software (comma separated)</label>
                    <input
                      type="text"
                      value={data.quickProfile?.keySoftware || ''}
                      onChange={(e) => updateQuickProfile('keySoftware', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: ABOUT DETAILS */}
              {activeTab === 'about' && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 mb-2">
                    <h2 className="text-xl font-bold text-[#F8FAFC]">About Section</h2>
                    <button
                      onClick={() => handleSaveSection('about')}
                      disabled={savingSection === 'about'}
                      className="px-4 py-2 bg-[#06B6D4] text-[#0B0E14] font-black text-xs uppercase tracking-wider rounded-lg hover:bg-[#22d3ee] disabled:opacity-40 transition"
                    >
                      {savingSection === 'about' ? 'Saving...' : 'Save About'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Name</label>
                      <input
                        type="text"
                        value={data.sections.about.name}
                        onChange={(e) => updateAbout('name', e.target.value)}
                        className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Portrait Image URL</label>
                      <input
                        type="text"
                        value={data.sections.about.portrait}
                        onChange={(e) => updateAbout('portrait', e.target.value)}
                        className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Tagline</label>
                    <input
                      type="text"
                      value={data.sections.about.title}
                      onChange={(e) => updateAbout('title', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Description</label>
                    <textarea
                      value={data.sections.about.body}
                      onChange={(e) => updateAbout('body', e.target.value)}
                      className="w-full h-32 bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl p-4 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition resize-y leading-relaxed"
                    />
                  </div>

                  {/* Facts highlight */}
                  <div className="space-y-4 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4]">Highlights facts</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {data.sections.about.facts.map((fact, idx) => (
                        <div key={idx} className="bg-[#0B0E14] p-4 rounded-xl border border-[#06B6D4]/10 space-y-2">
                          <input
                            type="text"
                            value={fact.value}
                            onChange={(e) => updateFact(idx, 'value', e.target.value)}
                            className="w-full bg-[#11151C] border border-[#06B6D4]/20 rounded-lg px-2.5 py-1.5 text-sm font-bold text-[#F8FAFC] focus:outline-none"
                            placeholder="Value"
                          />
                          <input
                            type="text"
                            value={fact.label}
                            onChange={(e) => updateFact(idx, 'label', e.target.value)}
                            className="w-full bg-[#11151C] border border-[#06B6D4]/20 rounded-lg px-2.5 py-1.5 text-xs text-[#94A3B8] focus:outline-none"
                            placeholder="Label"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EXPERIENCE TIMELINE */}
              {activeTab === 'experience' && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 mb-2">
                    <h2 className="text-xl font-bold text-[#F8FAFC]">Experience Timeline</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={addExperienceItem}
                        className="px-3.5 py-1.5 border border-[#06B6D4]/30 hover:border-[#06B6D4] hover:bg-[#06B6D4]/5 text-[#06B6D4] font-bold text-xs uppercase tracking-wider rounded-lg transition"
                      >
                        + Add Job
                      </button>
                      <button
                        onClick={() => handleSaveSection('experience')}
                        disabled={savingSection === 'experience'}
                        className="px-4 py-2 bg-[#06B6D4] text-[#0B0E14] font-black text-xs uppercase tracking-wider rounded-lg hover:bg-[#22d3ee] disabled:opacity-40 transition"
                      >
                        {savingSection === 'experience' ? 'Saving...' : 'Save timeline'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {data.sections.experience.items.map((job, jobIdx) => (
                      <div key={jobIdx} className="bg-[#0B0E14] border border-[#06B6D4]/15 rounded-2xl p-5 relative space-y-4">
                        
                        {/* Control buttons */}
                        <div className="absolute top-4 right-4 flex gap-1.5">
                          <button
                            onClick={() => moveExperienceItem(jobIdx, -1)}
                            disabled={jobIdx === 0}
                            className="p-1 bg-[#11151C] border border-[#06B6D4]/20 rounded-lg hover:border-[#06B6D4] text-xs text-[#94A3B8] disabled:opacity-30 transition"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveExperienceItem(jobIdx, 1)}
                            disabled={jobIdx === data.sections.experience.items.length - 1}
                            className="p-1 bg-[#11151C] border border-[#06B6D4]/20 rounded-lg hover:border-[#06B6D4] text-xs text-[#94A3B8] disabled:opacity-30 transition"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => removeExperienceItem(jobIdx)}
                            className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 transition"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Title details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-24">
                          <div>
                            <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#06B6D4] mb-1">Company</label>
                            <input
                              type="text"
                              value={job.company}
                              onChange={(e) => updateExperienceItemField(jobIdx, 'company', e.target.value)}
                              className="w-full bg-[#11151C] border border-[#06B6D4]/20 rounded-lg px-3 py-1.5 text-sm text-[#F8FAFC] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#06B6D4] mb-1">Role</label>
                            <input
                              type="text"
                              value={job.role}
                              onChange={(e) => updateExperienceItemField(jobIdx, 'role', e.target.value)}
                              className="w-full bg-[#11151C] border border-[#06B6D4]/20 rounded-lg px-3 py-1.5 text-sm text-[#F8FAFC] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#06B6D4] mb-1">Period</label>
                            <input
                              type="text"
                              value={job.period}
                              onChange={(e) => updateExperienceItemField(jobIdx, 'period', e.target.value)}
                              className="w-full bg-[#11151C] border border-[#06B6D4]/20 rounded-lg px-3 py-1.5 text-sm text-[#F8FAFC] focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Points */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#94A3B8]">Key descriptions</span>
                            <button
                              onClick={() => addExperiencePoint(jobIdx)}
                              className="px-2 py-0.5 border border-[#06B6D4]/20 hover:border-[#06B6D4] text-[#06B6D4] font-bold text-[0.65rem] uppercase tracking-wider rounded-lg transition"
                            >
                              + Add Point
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {job.points.map((point, ptIdx) => (
                              <div key={ptIdx} className="flex gap-2 items-center">
                                <span className="text-[#06B6D4] font-bold">•</span>
                                <input
                                  type="text"
                                  value={point}
                                  onChange={(e) => updateExperiencePoint(jobIdx, ptIdx, e.target.value)}
                                  className="w-full bg-[#11151C] border border-[#06B6D4]/10 rounded-lg px-3 py-1.5 text-sm text-[#F8FAFC] focus:outline-none"
                                />
                                <button
                                  onClick={() => removeExperiencePoint(jobIdx, ptIdx)}
                                  className="p-1 text-red-400 hover:text-red-300 font-bold transition text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 5: SKILLS & CONTACT INFO */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  
                  {/* Skills Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 mb-2">
                      <h2 className="text-xl font-bold text-[#F8FAFC]">Skills Badges</h2>
                      <button
                        onClick={() => handleSaveSection('skills')}
                        disabled={savingSection === 'skills'}
                        className="px-4 py-2 bg-[#06B6D4] text-[#0B0E14] font-black text-xs uppercase tracking-wider rounded-lg hover:bg-[#22d3ee] disabled:opacity-40 transition"
                      >
                        {savingSection === 'skills' ? 'Saving...' : 'Save Skills'}
                      </button>
                    </div>

                    <form onSubmit={addSkill} className="flex gap-3">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add new skill..."
                        className="bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition flex-grow"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#06B6D4]/10 border border-[#06B6D4]/30 hover:border-[#06B6D4] text-[#06B6D4] font-bold text-xs uppercase tracking-wider rounded-xl transition"
                      >
                        Add
                      </button>
                    </form>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {data.sections.skills.items.map((skill, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 border border-[#06B6D4]/25 bg-[#06B6D4]/5 rounded-full text-sm font-semibold text-[#06B6D4]"
                        >
                          <span>{skill}</span>
                          <button
                            onClick={() => removeSkill(idx)}
                            className="hover:text-red-400 font-bold transition text-xs pl-1 border-l border-[#06B6D4]/20"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 pt-4 border-t border-[#1E293B]">
                    <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 mb-2">
                      <h2 className="text-xl font-bold text-[#F8FAFC]">Contact Info</h2>
                      <button
                        onClick={() => handleSaveSection('contact')}
                        disabled={savingSection === 'contact'}
                        className="px-4 py-2 bg-[#06B6D4] text-[#0B0E14] font-black text-xs uppercase tracking-wider rounded-lg hover:bg-[#22d3ee] disabled:opacity-40 transition"
                      >
                        {savingSection === 'contact' ? 'Saving...' : 'Save Contact'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.sections.contact.items.map((contact, idx) => (
                        <div key={idx} className="bg-[#0B0E14] p-4 border border-[#06B6D4]/15 rounded-2xl space-y-3">
                          <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#06B6D4]">{contact.label}</label>
                          <input
                            type="text"
                            value={contact.value}
                            onChange={(e) => updateContactItem(idx, 'value', e.target.value)}
                            className="w-full bg-[#11151C] border border-[#06B6D4]/15 rounded-lg px-3 py-1.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4]"
                          />
                          <input
                            type="text"
                            value={contact.href}
                            onChange={(e) => updateContactItem(idx, 'href', e.target.value)}
                            className="w-full bg-[#11151C] border border-[#06B6D4]/15 rounded-lg px-3 py-1.5 text-xs text-[#94A3B8] focus:outline-none focus:border-[#06B6D4]"
                            placeholder="URL Link"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* REAL-TIME PREVIEW PANEL COLUMN */}
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#94A3B8] border-b border-[#1E293B] pb-3">
              ⚡ Real-time Mockup Preview
            </h2>

            {/* PREVIEW CONTAINER */}
            <div className="bg-[#0B0E14] border border-[#06B6D4]/15 rounded-[32px] p-6 space-y-6 relative overflow-hidden shadow-glow">
              
              {/* HERO TAB PREVIEW */}
              {activeTab === 'hero' && (
                <div className="space-y-4">
                  <span className="inline-block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#06B6D4]">
                    {data.hero.eyebrow || 'Branding | Graphic Design'}
                  </span>
                  <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight leading-snug">
                    {data.hero.heading || 'Crafting bold visual identities.'}
                  </h1>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    {data.hero.description || 'I help ambitious brands communicate with absolute confidence.'}
                  </p>
                </div>
              )}

              {/* RECRUITER TAB PREVIEW */}
              {activeTab === 'profile' && (
                <div className="liquid-glass rounded-3xl p-6 border border-[#06B6D4]/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <span className="text-[0.65rem] font-extrabold uppercase tracking-widest text-[#06B6D4]">
                    Hiring Fast Track
                  </span>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mt-1.5 mb-5">Quick Profile</h3>
                  
                  <div className="space-y-3.5 text-sm">
                    <div className="flex justify-between border-b border-[#06B6D4]/10 pb-2">
                      <span className="text-[#94A3B8]">Role sought</span>
                      <span className="text-[#F8FAFC] font-semibold">{data.quickProfile?.roleSought}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#06B6D4]/10 pb-2">
                      <span className="text-[#94A3B8]">Experience</span>
                      <span className="text-[#F8FAFC] font-semibold">{data.quickProfile?.experience}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#06B6D4]/10 pb-2">
                      <span className="text-[#94A3B8]">Location</span>
                      <span className="text-[#F8FAFC] font-semibold">{data.quickProfile?.location}</span>
                    </div>
                    <div className="flex justify-between items-baseline gap-4">
                      <span className="text-[#94A3B8] whitespace-nowrap">Key Software</span>
                      <span className="text-[#F8FAFC] font-semibold text-right">{data.quickProfile?.keySoftware}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ABOUT TAB PREVIEW */}
              {activeTab === 'about' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#11151C] border border-[#06B6D4]/20 flex items-center justify-center overflow-hidden">
                      {data.sections.about.portrait ? (
                        <img src={data.sections.about.portrait} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">👤</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#F8FAFC]">{data.sections.about.name}</h4>
                      <p className="text-xs text-[#06B6D4] font-semibold">{data.meta.role}</p>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#F8FAFC] leading-normal">{data.sections.about.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{data.sections.about.body}</p>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {data.sections.about.facts.map((fact, idx) => (
                      <div key={idx} className="bg-[#11151C] p-3 rounded-xl border border-[#06B6D4]/10 text-center">
                        <span className="block text-sm font-black text-[#06B6D4]">{fact.value || '0'}</span>
                        <span className="block text-[0.6rem] text-[#94A3B8] uppercase tracking-wider mt-0.5">{fact.label || 'Fact'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXPERIENCE TAB PREVIEW */}
              {activeTab === 'experience' && (
                <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="border-l border-[#06B6D4]/20 pl-4 space-y-6">
                    {data.sections.experience.items.map((job, idx) => (
                      <div key={idx} className="relative space-y-1">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="text-sm font-bold text-[#F8FAFC]">{job.company}</h4>
                          <span className="text-[0.65rem] text-[#06B6D4] font-extrabold uppercase">{job.period}</span>
                        </div>
                        <p className="text-xs text-[#06B6D4]/80 font-semibold">{job.role}</p>
                        <ul className="text-[0.7rem] text-[#94A3B8] list-disc pl-4 space-y-1 pt-1.5">
                          {job.points.slice(0, 2).map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKILLS TAB PREVIEW */}
              {activeTab === 'skills' && (
                <div className="space-y-5">
                  <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#06B6D4] border-b border-[#06B6D4]/10 pb-1.5">
                    Skills Badges
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {data.sections.skills.items.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-semibold bg-[#06B6D4]/5 border border-[#06B6D4]/15 text-[#06B6D4] rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#06B6D4] border-b border-[#06B6D4]/10 pb-1.5 pt-4">
                    Contact Grid
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {data.sections.contact.items.map((item, idx) => (
                      <div key={idx} className="bg-[#11151C] p-2.5 rounded-xl border border-[#06B6D4]/10">
                        <span className="block text-[0.6rem] text-[#94A3B8] uppercase">{item.label}</span>
                        <span className="block text-[#F8FAFC] font-semibold truncate mt-0.5">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
