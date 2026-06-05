import React, { useState, useEffect } from 'react';
import portfolioRaw from './data/portfolio.js?raw';
import { portfolio as initialPortfolio } from './data/portfolio';
import { db, auth, isFirebaseConfigured } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Admin() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (isFirebaseConfigured) {
      return false; // Will be set by onAuthStateChanged
    }
    return sessionStorage.getItem('admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isFirebaseConfigured);

  // Editor states
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' or 'raw'
  const [visualSection, setVisualSection] = useState('hero'); // 'hero', 'about', 'experience', 'skills', 'contact'
  const [publishStatus, setPublishStatus] = useState(''); // '', 'publishing', 'success', 'error'
  
  // Data states
  const [data, setData] = useState(initialPortfolio);
  const [rawCode, setRawCode] = useState(portfolioRaw);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Set up Firebase Auth listener
  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsLoggedIn(!!user);
        setLoading(false);
      });
      return unsubscribe;
    }
  }, []);

  // Fetch live Firestore configuration on login
  useEffect(() => {
    if (isFirebaseConfigured && isLoggedIn) {
      const docRef = doc(db, 'configs', 'portfolio');
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const fetchedData = docSnap.data();
            setData(fetchedData);
            setRawCode(generateCodeFromData(fetchedData));
          }
        })
        .catch((err) => {
          console.error("Failed to load live configurations from Firestore:", err);
        });
    }
  }, [isLoggedIn]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isFirebaseConfigured) {
      try {
        await signInWithEmailAndPassword(auth, username, password);
      } catch (err) {
        setError(err.message || 'Invalid email or password');
      } finally {
        setLoading(false);
      }
    } else {
      const envUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
      const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'harish2026';

      if (username === envUsername && password === envPassword) {
        setIsLoggedIn(true);
        sessionStorage.setItem('admin_auth', 'true');
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    } else {
      sessionStorage.removeItem('admin_auth');
      setIsLoggedIn(false);
    }
  };

  // Helper to generate code string from form data
  const generateCodeFromData = (formData) => {
    const dataCopy = JSON.parse(JSON.stringify(formData));
    
    // Replace portfolioPage.categories with the placeholder string (without quotes later)
    dataCopy.portfolioPage = {
      ...dataCopy.portfolioPage,
      categories: '__DRIVE_CATEGORIES_PLACEHOLDER__'
    };

    let jsonString = JSON.stringify(dataCopy, null, 2);
    
    // Replace placeholder with the imported drivePortfolioCategories variable name
    jsonString = jsonString.replace(
      '"__DRIVE_CATEGORIES_PLACEHOLDER__"',
      'drivePortfolioCategories'
    );

    return `import { drivePortfolioCategories } from './drivePortfolio'\n\nexport const portfolio = ${jsonString}\n`;
  };

  // Handle Direct Publishing to Firestore
  const handlePublishLive = async () => {
    if (!isFirebaseConfigured) return;
    setPublishStatus('publishing');
    try {
      const docRef = doc(db, 'configs', 'portfolio');
      // If we are in visual tab, save visual data state. If we are in raw tab, we notify them to download or update visual state first.
      if (activeTab === 'visual') {
        await setDoc(docRef, data);
        setPublishStatus('success');
      } else {
        // Direct publish from raw code is restricted to avoid schema issues, suggest using visual mode or downloading
        alert("To publish raw code changes live, please apply the changes to the files locally, or use the Visual Form Editor to publish directly.");
        setPublishStatus('');
      }
    } catch (err) {
      console.error("Error publishing config to Firebase:", err);
      setPublishStatus('error');
    }
  };

  // Handle Download for Visual Form
  const handleDownloadVisual = () => {
    const generated = generateCodeFromData(data);
    triggerDownload(generated);
  };

  // Handle Download for Raw Code Textarea
  const handleDownloadRaw = () => {
    triggerDownload(rawCode);
  };

  const triggerDownload = (codeString) => {
    const blob = new Blob([codeString], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Form State Mutators
  const updateMeta = (key, value) => {
    setData(prev => ({
      ...prev,
      meta: { ...prev.meta, [key]: value }
    }));
  };

  const updateHero = (key, value) => {
    setData(prev => ({
      ...prev,
      hero: { ...prev.hero, [key]: value }
    }));
  };

  const updateQuickProfile = (key, value) => {
    setData(prev => ({
      ...prev,
      quickProfile: {
        ...prev.quickProfile,
        [key]: value
      }
    }));
  };

  const updateAbout = (key, value) => {
    setData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        about: { ...prev.sections.about, [key]: value }
      }
    }));
  };

  const updateAboutFact = (index, key, value) => {
    setData(prev => {
      const facts = [...prev.sections.about.facts];
      facts[index] = { ...facts[index], [key]: value };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          about: { ...prev.sections.about, facts }
        }
      };
    });
  };

  const updateExperienceItem = (index, key, value) => {
    setData(prev => {
      const items = [...prev.sections.experience.items];
      items[index] = { ...items[index], [key]: value };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const updateExperiencePoint = (jobIndex, pointIndex, value) => {
    setData(prev => {
      const items = [...prev.sections.experience.items];
      const points = [...items[jobIndex].points];
      points[pointIndex] = value;
      items[jobIndex] = { ...items[jobIndex], points };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const addExperiencePoint = (jobIndex) => {
    setData(prev => {
      const items = [...prev.sections.experience.items];
      const points = [...items[jobIndex].points, ''];
      items[jobIndex] = { ...items[jobIndex], points };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const removeExperiencePoint = (jobIndex, pointIndex) => {
    setData(prev => {
      const items = [...prev.sections.experience.items];
      const points = items[jobIndex].points.filter((_, idx) => idx !== pointIndex);
      items[jobIndex] = { ...items[jobIndex], points };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const addExperienceItem = () => {
    setData(prev => {
      const newItem = {
        company: 'New Company',
        role: 'Visual Designer',
        period: 'Dates (e.g. Jan 2026 - Present)',
        points: ['Designed high-impact visual systems.']
      };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: {
            ...prev.sections.experience,
            items: [newItem, ...prev.sections.experience.items]
          }
        }
      };
    });
  };

  const removeExperienceItem = (index) => {
    setData(prev => {
      const items = prev.sections.experience.items.filter((_, idx) => idx !== index);
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const moveExperienceItem = (index, direction) => {
    setData(prev => {
      const items = [...prev.sections.experience.items];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;
      
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      
      return {
        ...prev,
        sections: {
          ...prev.sections,
          experience: { ...prev.sections.experience, items }
        }
      };
    });
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    setData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        skills: {
          ...prev.sections.skills,
          items: [...prev.sections.skills.items, newSkillInput.trim()]
        }
      }
    }));
    setNewSkillInput('');
  };

  const removeSkill = (index) => {
    setData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        skills: {
          ...prev.sections.skills,
          items: prev.sections.skills.items.filter((_, idx) => idx !== index)
        }
      }
    }));
  };

  const updateContactItem = (index, key, value) => {
    setData(prev => {
      const items = [...prev.sections.contact.items];
      items[index] = { ...items[index], [key]: value };
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
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-6">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#06B6D4] animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#06B6D4] opacity-[0.08] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#8B5CF6] opacity-[0.08] blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md liquid-glass p-8 rounded-[32px] border border-[#06B6D4]/20 shadow-glow relative z-10">
          <div className="text-center mb-8">
            <span className="inline-block text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-[#06B6D4] mb-2">
              {isFirebaseConfigured ? 'Firebase Protected' : 'Security Access'}
            </span>
            <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight">Admin Console</h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              {isFirebaseConfigured 
                ? 'Enter email & password to publish live updates.' 
                : 'Enter credentials to customize portfolio data.'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                {isFirebaseConfigured ? 'Admin Email' : 'Username'}
              </label>
              <input
                type={isFirebaseConfigured ? 'email' : 'text'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#11151C]/60 border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition"
                placeholder={isFirebaseConfigured ? 'admin@example.com' : 'Enter username'}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#11151C]/60 border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-3.5 bg-[#06B6D4] text-[#0B0E14] font-extrabold text-sm uppercase tracking-wider rounded-xl hover:bg-[#22d3ee] transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Authenticate
            </button>
          </form>

          <div className="mt-8 text-center text-xs">
            <a href="/" className="text-[#06B6D4]/75 hover:text-[#06B6D4] hover:underline transition">
              ← Back to Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#94A3B8] p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Connection status banner (if local mode) */}
        {!isFirebaseConfigured && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs text-amber-400 font-semibold shadow-md">
            <span>⚠️ Firebase variables not configured. Operating in Local Download Mode. Add VITE_FIREBASE_* environment keys to unlock instant live publishing.</span>
            <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline hover:text-amber-200">Firebase Console →</a>
          </div>
        )}

        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#06B6D4]/20 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight">Portfolio Control Panel</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isFirebaseConfigured 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${
                  isFirebaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />
                {isFirebaseConfigured ? 'Firebase Active' : 'Local Mode'}
              </span>
            </div>
            <p className="mt-2 text-sm text-[#94A3B8]">
              {isFirebaseConfigured
                ? 'Your site fetches data live from Firestore. Publish instantly or download files as backups.'
                : 'Customize your site locally and download the portfolio.js file to overwrite your configurations.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            
            {/* Display Publish Live button if Firebase is Active */}
            {isFirebaseConfigured && activeTab === 'visual' && (
              <button 
                onClick={handlePublishLive}
                disabled={publishStatus === 'publishing'}
                className={`px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition shadow-[0_0_15px_rgba(16,185,129,0.3)] ${
                  publishStatus === 'publishing'
                    ? 'bg-emerald-600/30 text-emerald-500 cursor-not-allowed border border-emerald-500/30'
                    : 'bg-emerald-500 text-[#0B0E14] hover:bg-emerald-400'
                }`}
              >
                {publishStatus === 'publishing' ? 'Publishing...' : 'Publish Live'}
              </button>
            )}

            <button 
              onClick={activeTab === 'visual' ? handleDownloadVisual : handleDownloadRaw}
              className="px-5 py-2.5 bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4] font-black text-xs uppercase tracking-widest rounded-lg hover:bg-[#06B6D4]/20 transition"
            >
              Download Backup
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 border border-[#06B6D4]/20 hover:border-red-500/50 hover:text-red-400 text-[#06B6D4] font-bold text-xs uppercase tracking-wider rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Publish toasts */}
        {publishStatus === 'success' && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-2xl animate-fade-up">
            🎉 Changes successfully published live! Your portfolio website has been updated instantly.
          </div>
        )}
        {publishStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-2xl animate-fade-up">
            ❌ Failed to publish live. Check your Firebase connectivity and configuration security rules.
          </div>
        )}

        {/* Tab Toggle (Visual Form vs Raw Code Editor) */}
        <div className="flex gap-2 border-b border-[#1E293B] mb-6">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition ${
              activeTab === 'visual' 
                ? 'border-[#06B6D4] text-[#F8FAFC]' 
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            📋 Visual Form Editor
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition ${
              activeTab === 'raw' 
                ? 'border-[#06B6D4] text-[#F8FAFC]' 
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            💻 Direct Code Editor (Raw)
          </button>
        </div>

        {activeTab === 'visual' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Sidebar for Sections */}
            <div className="lg:col-span-1 space-y-1">
              {[
                { id: 'hero', label: '🚀 Hero & Metadata' },
                { id: 'profile', label: '💼 Recruiter Profile' },
                { id: 'about', label: '👤 About Details' },
                { id: 'experience', label: '⏳ Experience timeline' },
                { id: 'skills', label: '🛠️ Skills & Contact' }
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setVisualSection(section.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                    visualSection === section.id
                      ? 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/30 shadow-[0_0_10px_rgba(6,182,212,0.05)]'
                      : 'hover:bg-[#11151C] text-[#94A3B8]'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Visual Form Area */}
            <div className="lg:col-span-3 bg-[#11151C]/60 border border-[#06B6D4]/15 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* HERO & METADATA SECTION */}
              {visualSection === 'hero' && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-[#F8FAFC] border-b border-[#1E293B] pb-3 mb-2">Hero & Site Metadata</h2>
                  
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

              {/* RECRUITER PROFILE (HIRING FAST TRACK) */}
              {visualSection === 'profile' && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-[#F8FAFC] border-b border-[#1E293B] pb-3 mb-2">Recruiter Quick Card Details</h2>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Role sought</label>
                    <input
                      type="text"
                      value={data.quickProfile?.roleSought || ''}
                      onChange={(e) => updateQuickProfile('roleSought', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                      placeholder="e.g. Visual / Motion Designer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Experience period</label>
                    <input
                      type="text"
                      value={data.quickProfile?.experience || ''}
                      onChange={(e) => updateQuickProfile('experience', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                      placeholder="e.g. 2+ Years (Agency & Brand)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Location status</label>
                    <input
                      type="text"
                      value={data.quickProfile?.location || ''}
                      onChange={(e) => updateQuickProfile('location', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                      placeholder="e.g. India (Remote / Relocation)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Key softwares list</label>
                    <input
                      type="text"
                      value={data.quickProfile?.keySoftware || ''}
                      onChange={(e) => updateQuickProfile('keySoftware', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                      placeholder="e.g. After Effects, Premiere Pro, Photoshop"
                    />
                  </div>
                </div>
              )}

              {/* ABOUT DETAILS SECTION */}
              {visualSection === 'about' && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-[#F8FAFC] border-b border-[#1E293B] pb-3 mb-2">About Section Details</h2>
                  
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">Portrait Image Path</label>
                      <input
                        type="text"
                        value={data.sections.about.portrait}
                        onChange={(e) => updateAbout('portrait', e.target.value)}
                        className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">About tagline</label>
                    <input
                      type="text"
                      value={data.sections.about.title}
                      onChange={(e) => updateAbout('title', e.target.value)}
                      className="w-full bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2">About Description</label>
                    <textarea
                      value={data.sections.about.body}
                      onChange={(e) => updateAbout('body', e.target.value)}
                      className="w-full h-32 bg-[#0B0E14] border border-[#06B6D4]/20 rounded-xl p-4 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition resize-y leading-relaxed"
                    />
                  </div>

                  {/* Facts list */}
                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#06B6D4]">Highlights facts</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {data.sections.about.facts.map((fact, idx) => (
                        <div key={idx} className="bg-[#0B0E14] p-4 rounded-2xl border border-[#06B6D4]/10 space-y-2">
                          <input
                            type="text"
                            value={fact.value}
                            onChange={(e) => updateAboutFact(idx, 'value', e.target.value)}
                            className="w-full bg-[#11151C]/60 border border-[#06B6D4]/20 rounded-lg px-3 py-1.5 text-sm font-bold text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4]"
                            placeholder="Value (e.g. 2+)"
                          />
                          <input
                            type="text"
                            value={fact.label}
                            onChange={(e) => updateAboutFact(idx, 'label', e.target.value)}
                            className="w-full bg-[#11151C]/60 border border-[#06B6D4]/20 rounded-lg px-3 py-1.5 text-xs text-[#94A3B8] focus:outline-none focus:border-[#06B6D4]"
                            placeholder="Label (e.g. Experience)"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EXPERIENCE TIMELINE SECTION */}
              {visualSection === 'experience' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 mb-2">
                    <h2 className="text-xl font-bold text-[#F8FAFC]">Work Experience Timeline</h2>
                    <button
                      onClick={addExperienceItem}
                      className="px-3.5 py-1.5 bg-[#06B6D4]/10 border border-[#06B6D4]/30 hover:border-[#06B6D4] hover:bg-[#06B6D4]/15 text-[#06B6D4] font-bold text-xs uppercase tracking-wider rounded-lg transition"
                    >
                      + Add Job
                    </button>
                  </div>

                  <div className="space-y-6">
                    {data.sections.experience.items.map((job, jobIdx) => (
                      <div key={jobIdx} className="bg-[#0B0E14] border border-[#06B6D4]/15 rounded-2xl p-5 relative space-y-4 shadow-lg">
                        
                        {/* Control buttons inside Card */}
                        <div className="absolute top-4 right-4 flex gap-1.5">
                          <button
                            onClick={() => moveExperienceItem(jobIdx, -1)}
                            disabled={jobIdx === 0}
                            className="p-1.5 bg-[#11151C] border border-[#06B6D4]/20 rounded-lg hover:border-[#06B6D4] text-xs text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:pointer-events-none transition"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveExperienceItem(jobIdx, 1)}
                            disabled={jobIdx === data.sections.experience.items.length - 1}
                            className="p-1.5 bg-[#11151C] border border-[#06B6D4]/20 rounded-lg hover:border-[#06B6D4] text-xs text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:pointer-events-none transition"
                            title="Move Down"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => removeExperienceItem(jobIdx)}
                            className="p-1.5 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 text-xs text-red-400 font-bold transition"
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Text details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-24">
                          <div>
                            <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#06B6D4] mb-1">Company</label>
                            <input
                              type="text"
                              value={job.company}
                              onChange={(e) => updateExperienceItem(jobIdx, 'company', e.target.value)}
                              className="w-full bg-[#11151C]/60 border border-[#06B6D4]/20 rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4]"
                            />
                          </div>
                          <div>
                            <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#06B6D4] mb-1">Role</label>
                            <input
                              type="text"
                              value={job.role}
                              onChange={(e) => updateExperienceItem(jobIdx, 'role', e.target.value)}
                              className="w-full bg-[#11151C]/60 border border-[#06B6D4]/20 rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4]"
                            />
                          </div>
                          <div>
                            <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#06B6D4] mb-1">Period</label>
                            <input
                              type="text"
                              value={job.period}
                              onChange={(e) => updateExperienceItem(jobIdx, 'period', e.target.value)}
                              className="w-full bg-[#11151C]/60 border border-[#06B6D4]/20 rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4]"
                            />
                          </div>
                        </div>

                        {/* Bullet points */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#94A3B8]">Key points & details</span>
                            <button
                              onClick={() => addExperiencePoint(jobIdx)}
                              className="px-2 py-1 border border-[#06B6D4]/25 hover:border-[#06B6D4] hover:bg-[#06B6D4]/5 text-[#06B6D4] font-bold text-[0.65rem] uppercase tracking-wider rounded-lg transition"
                            >
                              + Add Point
                            </button>
                          </div>
                          <div className="space-y-2">
                            {job.points.map((point, pointIdx) => (
                              <div key={pointIdx} className="flex gap-2 items-center">
                                <span className="text-[#06B6D4] font-bold">•</span>
                                <input
                                  type="text"
                                  value={point}
                                  onChange={(e) => updateExperiencePoint(jobIdx, pointIdx, e.target.value)}
                                  className="w-full bg-[#11151C]/60 border border-[#06B6D4]/10 rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4]"
                                />
                                <button
                                  onClick={() => removeExperiencePoint(jobIdx, pointIdx)}
                                  className="p-2 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-lg text-xs transition"
                                  title="Delete point"
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

              {/* SKILLS & CONTACTS SECTION */}
              {visualSection === 'skills' && (
                <div className="space-y-6">
                  
                  {/* Skills Grid */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#F8FAFC] border-b border-[#1E293B] pb-3 mb-2">Skills Badges</h2>
                    
                    <form onSubmit={addSkill} className="flex gap-3">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
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
                          className="flex items-center gap-2 px-3 py-1.5 border border-[#06B6D4]/20 bg-[#06B6D4]/5 rounded-full text-sm font-semibold text-[#06B6D4]"
                        >
                          <span>{skill}</span>
                          <button
                            onClick={() => removeSkill(idx)}
                            className="hover:text-red-400 font-bold transition text-xs pl-1 border-l border-[#06B6D4]/20"
                            title="Remove Skill"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contacts List */}
                  <div className="space-y-4 pt-4">
                    <h2 className="text-xl font-bold text-[#F8FAFC] border-b border-[#1E293B] pb-3 mb-2">Contact Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.sections.contact.items.map((contact, idx) => (
                        <div key={idx} className="bg-[#0B0E14] p-4 border border-[#06B6D4]/15 rounded-2xl space-y-3">
                          <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#06B6D4]">{contact.label}</label>
                          <input
                            type="text"
                            value={contact.value}
                            onChange={(e) => updateContactItem(idx, 'value', e.target.value)}
                            className="w-full bg-[#11151C]/60 border border-[#06B6D4]/15 rounded-lg px-3 py-1.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4]"
                          />
                          <input
                            type="text"
                            value={contact.href}
                            onChange={(e) => updateContactItem(idx, 'href', e.target.value)}
                            className="w-full bg-[#11151C]/60 border border-[#06B6D4]/15 rounded-lg px-3 py-1.5 text-xs text-[#94A3B8] focus:outline-none focus:border-[#06B6D4]"
                            placeholder="URL link / mailto: link"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        ) : (
          /* RAW TEXT AREA DIRECT FILE EDITOR */
          <div className="space-y-4">
            <div className="w-full bg-[#11151C] rounded-2xl border border-[#06B6D4]/30 overflow-hidden shadow-2xl">
              <div className="bg-[#161B22] px-4 py-2.5 border-b border-[#06B6D4]/30 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-xs font-mono text-[#06B6D4]">src/data/portfolio.js</span>
              </div>
              <textarea 
                className="w-full h-[70vh] bg-transparent p-6 text-sm font-mono text-[#F8FAFC] focus:outline-none resize-none leading-relaxed"
                value={rawCode}
                onChange={(e) => setRawCode(e.target.value)}
                spellCheck="false"
              />
            </div>
          </div>
        )}
        
        <div className="mt-12 text-center text-xs pb-12 border-t border-[#1E293B] pt-6">
          <a href="/" className="text-[#06B6D4] hover:underline transition">← Back to Live Portfolio</a>
        </div>
      </div>
    </div>
  );
}
