export interface MetaData {
  title: string;
  role: string;
  label: string;
  copyright: string;
}

export interface QuickProfile {
  roleSought: string;
  experience: string;
  location: string;
  keySoftware: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  page?: string;
}

export interface HeroAction {
  label: string;
  href: string;
  external?: boolean;
  variant: 'primary' | 'secondary';
}

export interface HeroHighlight {
  title: string;
  company: string;
  period: string;
  services: string[];
  stats: Array<{ value: string; label: string }>;
  clients: string[];
  quote: string;
  note: string;
  linkedIn: string;
}

export interface HeroData {
  eyebrow: string;
  heading: string;
  description: string;
  actions: HeroAction[];
  highlights: HeroHighlight[];
}

export interface ServiceItem {
  title: string;
  description: string;
  number: string;
}

export interface CaseStudyItem {
  title: string;
  category: string;
  thumbnail: string;
  challenge: string;
  goal: string;
  process: string[];
  output: string;
  result: string;
  type?: 'video';
  id?: string;
  href?: string;
}

export interface MotionItem {
  title: string;
  id: string;
}

export interface AboutFact {
  value: string;
  label: string;
}

export interface AboutData {
  id: string;
  eyebrow: string;
  name: string;
  title: string;
  body: string;
  portrait: string;
  facts: AboutFact[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  points: string[];
}

export interface BrandItem {
  name: string;
  logo: string;
  logoUrl?: string;
  linkedIn?: string;
  location: string;
  type: string;
}

export interface ContactItem {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

export interface SectionsData {
  services: {
    id: string;
    eyebrow: string;
    title: string;
    body: string;
    items: ServiceItem[];
  };
  'case-studies': {
    id: string;
    eyebrow: string;
    title: string;
    body: string;
    items: CaseStudyItem[];
    action: {
      label: string;
      href: string;
    };
  };
  motion: {
    id: string;
    eyebrow: string;
    title: string;
    body: string;
    items: MotionItem[];
  };
  about: AboutData;
  experience: {
    id: string;
    eyebrow: string;
    title: string;
    items: ExperienceItem[];
  };
  skills: {
    id: string;
    eyebrow: string;
    title: string;
    items: string[];
  };
  brands: {
    id: string;
    eyebrow: string;
    title: string;
    body: string;
    items: BrandItem[];
  };
  contact: {
    id: string;
    eyebrow: string;
    title: string;
    items: ContactItem[];
  };
}

export interface PortfolioData {
  meta: MetaData;
  quickProfile: QuickProfile;
  navigation: NavigationItem[];
  hero: HeroData;
  sections: SectionsData;
  portfolioPage: {
    id: string;
    eyebrow: string;
    title: string;
    intro: string;
    categories: any[];
  };
}
