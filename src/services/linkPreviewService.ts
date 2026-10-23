import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

export interface LinkPreviewItem {
  path: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  updatedAt?: number;
}

export type LinkPreviewMap = Record<string, LinkPreviewItem>;

const LOCAL_STORAGE_KEY = 'campusai_link_previews';

export const DEFAULT_LINK_PREVIEWS: LinkPreviewItem[] = [
  { path: '/', title: 'Main Portal Dashboard', subtitle: 'Home Overview', imageUrl: '/assets/aistudio/20260926_064311_0000_ae959d53.png' },
  { path: '/calculator', title: 'Aggregate Calculator Hub', subtitle: 'All Universities', imageUrl: '/assets/aistudio/20260926_165355_0000_6b1fccc4.png' },
  { path: '/login', title: 'Student Portal Login', subtitle: 'Authentication & Profile', imageUrl: '/assets/aistudio/20260926_170625_0000_4d51196b.png' },
  { path: '/unilag-aggregate-calculator', title: 'UNILAG Calculator', subtitle: 'Lagos', imageUrl: '/assets/aistudio/Ui_20260926_170816_0000_46783bf5.png' },
  { path: '/ui-aggregate-calculator', title: 'UI Calculator', subtitle: 'Ibadan', imageUrl: '/assets/aistudio/Ui_20260926_170925_0000_628937b8.png' },
  { path: '/lasu-aggregate-calculator', title: 'LASU Calculator', subtitle: 'Lagos State', imageUrl: '/assets/aistudio/Ui_20260926_171331_0000_cf11025e.png' },
  { path: '/oau-aggregate-calculator', title: 'OAU Calculator', subtitle: 'Ife', imageUrl: '/assets/aistudio/Ui_20260926_171546_0000_09e29f43.png' },
  { path: '/uniben-aggregate-calculator', title: 'UNIBEN Calculator', subtitle: 'Benin', imageUrl: '/assets/aistudio/Ui_20260926_172043_0000_8d488f73.png' },
  { path: '/futa-aggregate-calculator', title: 'FUTA Calculator', subtitle: 'Akure', imageUrl: '/assets/aistudio/Ui_20260926_172247_0000_74ebec34.png' },
  { path: '/funaab-aggregate-calculator', title: 'FUNAAB Calculator', subtitle: 'Abeokuta', imageUrl: '/assets/aistudio/Ui_20260926_172328_0000_856260b2.png' },
  { path: '/cutoff-calculator', title: 'Cutoff & Aggregate Finder', subtitle: 'Requirements', imageUrl: '/assets/aistudio/Ui_20260926_172809_0000_bdd29de8.png' },
  { path: '/syllabus', title: 'Syllabus Finder', subtitle: 'JAMB 2026', imageUrl: '/assets/aistudio/Ui_20260926_172502_0000_942cd741.png' },
  { path: '/e-syllabus', title: 'JAMB E-Syllabus', subtitle: 'Official Syllabus', imageUrl: '/assets/aistudio/Ui_20260926_172502_0000_942cd741.png' },
  { path: '/postutme', title: 'Post-UTME Release Hub', subtitle: 'Admission Status', imageUrl: '/assets/aistudio/Ui_20260926_172502_0000_942cd741.png' },
  { path: '/directory', title: 'University Directory', subtitle: 'Institutions', imageUrl: '/assets/aistudio/Ui_20260926_172848_0000_dafc826e.png' },
  { path: '/admission-checklist', title: 'Admission Checklist', subtitle: 'Documents', imageUrl: '/assets/aistudio/Ui_20260926_172731_0000_22824e3e.png' },
  { path: '/admission-2026-summary', title: '2026/2027 Admission Summary & Review', subtitle: 'Annual Report', imageUrl: '/assets/aistudio/Ui_20260926_172731_0000_22824e3e.png' },
  { path: '/cgpa-calculator', title: 'CGPA Tracker', subtitle: 'Analytics', imageUrl: '/assets/aistudio/20260926_165355_0000_6b1fccc4.png' },
  { path: '/brochure', title: 'JAMB Brochure (IBASS)', subtitle: 'Requirements', imageUrl: '/assets/aistudio/Ui_20260926_172848_0000_dafc826e.png' },
  { path: '/news', title: 'Verified News & Updates', subtitle: 'Admission News', imageUrl: '/assets/aistudio/Ui_20260926_172502_0000_942cd741.png' },
  { path: '/feedback', title: 'Student Feedback & Support', subtitle: 'Help Desk', imageUrl: '/assets/aistudio/20260926_170625_0000_4d51196b.png' },
];

export const getStoredLinkPreviews = (): LinkPreviewMap => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse local link previews:', e);
  }
  return {};
};

export const fetchLinkPreviewsFromCloud = async (): Promise<LinkPreviewMap> => {
  const localMap = getStoredLinkPreviews();
  if (!db) return localMap;

  try {
    const snap = await getDoc(doc(db, 'settings', 'link_previews'));
    if (snap.exists()) {
      const data = snap.data();
      const cloudMap = (data.previews || {}) as LinkPreviewMap;
      const merged = { ...localMap, ...cloudMap };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        } catch (err) {
          // If storage exceeded, save lightweight version without massive base64s to local
          const lightweight: LinkPreviewMap = {};
          Object.entries(merged).forEach(([k, v]) => {
            lightweight[k] = { ...v, imageUrl: v.imageUrl && v.imageUrl.length > 50000 ? '' : v.imageUrl };
          });
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lightweight));
          } catch (e2) {
            console.warn('LocalStorage quota limit reached:', e2);
          }
        }
      }
      return merged;
    }
  } catch (e) {
    console.warn('Failed to fetch link previews from Firestore:', e);
  }
  return localMap;
};

export const saveLinkPreviewImage = async (
  path: string, 
  imageUrl: string, 
  title?: string, 
  subtitle?: string
): Promise<LinkPreviewMap> => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const currentMap = getStoredLinkPreviews();
  
  const existing = currentMap[normalizedPath] || {
    path: normalizedPath,
    title: title || normalizedPath,
    subtitle: subtitle || 'Custom Link',
    imageUrl: ''
  };

  const updatedItem: LinkPreviewItem = {
    ...existing,
    title: title || existing.title,
    subtitle: subtitle || existing.subtitle,
    imageUrl,
    updatedAt: Date.now()
  };

  const updatedMap = {
    ...currentMap,
    [normalizedPath]: updatedItem
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMap));
    } catch (e) {
      console.warn('LocalStorage quota exceeded for link previews. Saving lightweight cache, cloud sync active:', e);
      try {
        const lightweightMap: LinkPreviewMap = {};
        Object.entries(updatedMap).forEach(([k, v]) => {
          lightweightMap[k] = {
            ...v,
            imageUrl: v.imageUrl && v.imageUrl.length > 50000 ? '' : v.imageUrl
          };
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lightweightMap));
      } catch (err) {
        console.warn('Could not save lightweight local link previews cache:', err);
      }
    }
  }

  if (db) {
    try {
      await setDoc(doc(db, 'settings', 'link_previews'), {
        previews: updatedMap,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (e) {
      console.error('Failed to write link_previews to Firestore:', e);
    }
  }

  return updatedMap;
};

export const deleteLinkPreviewImage = async (path: string): Promise<LinkPreviewMap> => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const currentMap = getStoredLinkPreviews();

  if (currentMap[normalizedPath]) {
    delete currentMap[normalizedPath];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentMap));
      } catch (e) {
        console.warn('Failed to update local link previews storage:', e);
      }
    }
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'link_previews'), {
          previews: currentMap,
          updatedAt: Timestamp.now()
        }, { merge: true });
      } catch (e) {
        console.error('Failed to update link_previews in Firestore:', e);
      }
    }
  }

  return currentMap;
};
