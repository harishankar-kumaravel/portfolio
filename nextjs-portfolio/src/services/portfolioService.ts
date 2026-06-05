import { db, isFirebaseConfigured } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { PortfolioData } from '../types/portfolio';
import { portfolio as fallbackPortfolio } from '../data/portfolio';

const SECTIONS = ['metadata', 'recruiter', 'hero', 'about', 'experience', 'skills', 'contact'];

// Fetch initial data for all sections
export async function getPortfolioFromFirestore(): Promise<PortfolioData> {
  const result: PortfolioData = JSON.parse(JSON.stringify(fallbackPortfolio));

  if (!isFirebaseConfigured) {
    return result;
  }

  try {
    const promises = SECTIONS.map(async (section) => {
      const docRef = doc(db, 'portfolio', section);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        mapDocToPortfolio(section, docData, result);
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error fetching portfolio from Firestore, using static fallback:", error);
  }

  return result;
}

// Save a specific section to Firestore
export async function savePortfolioSection(section: string, data: any): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase is not configured. Cannot save live changes.");
  }
  const docRef = doc(db, 'portfolio', section);
  await setDoc(docRef, data);
}

// Real-time listener for the public site
export function listenToPortfolio(callback: (data: PortfolioData) => void): () => void {
  const activeData: PortfolioData = JSON.parse(JSON.stringify(fallbackPortfolio));

  if (!isFirebaseConfigured) {
    callback(activeData);
    return () => {}; // No-op unsubscribe
  }

  const unsubscribes = SECTIONS.map((section) => {
    const docRef = doc(db, 'portfolio', section);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const docData = docSnap.data();
          mapDocToPortfolio(section, docData, activeData);
          callback({ ...activeData });
        }
      },
      (error) => {
        console.error(`Error listening to section ${section}:`, error);
      }
    );
  });

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
}

// Helper to map document fields to portfolio data structure
function mapDocToPortfolio(section: string, docData: any, target: PortfolioData) {
  switch (section) {
    case 'metadata':
      target.meta = docData as any;
      break;
    case 'recruiter':
      target.quickProfile = docData as any;
      break;
    case 'hero':
      target.hero = docData as any;
      break;
    case 'about':
      target.sections.about = docData as any;
      break;
    case 'experience':
      target.sections.experience = docData as any;
      break;
    case 'skills':
      target.sections.skills = docData as any;
      break;
    case 'contact':
      target.sections.contact = docData as any;
      break;
  }
}
