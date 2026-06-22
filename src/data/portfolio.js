import { drivePortfolioCategories } from './drivePortfolio'
// To use Firebase Storage URLs instead of Google Drive, run "node scripts/transfer-drive-to-firebase.mjs"
// and uncomment the line below (and comment out the drivePortfolioCategories import above):
// import { firebasePortfolioCategories as drivePortfolioCategories } from './firebasePortfolio'

export const portfolio = {
  meta: {
    title: 'Harishankar K',
    role: 'Hybrid Visual Designer',
    label: 'Visual Portfolio',
    copyright: '2026 Harishankar K',
  },
  quickProfile: {
    roleSought: 'Visual / Motion Designer',
    experience: '2+ Years (Agency & Brand)',
    location: 'India (Remote / Relocation)',
    keySoftware: 'After Effects, Premiere Pro, Photoshop, Illustrator, Maya',
  },
  navigation: [
    { id: 'home', label: 'Home', page: 'home' },
    { id: 'portfolio', label: 'Portfolio', page: 'portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'client-projects', label: 'Client Projects' },
    { id: 'motion', label: 'Motion' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'brands', label: 'Brands' },
    { id: 'contact', label: 'Contact' },
  ],
  hero: {
    eyebrow: 'Branding | Graphic Design | Motion Graphics',
    heading: 'Crafting bold visual identities and motion-driven experiences.',
    description:
      'I help ambitious brands communicate with absolute confidence. From striking visual systems and packaging to high-impact campaign assets and storytelling, I design experiences that leave a lasting impression.',
    actions: [
      {
        label: 'Explore Portfolio',
        href: '#portfolio',
        external: false,
        variant: 'primary',
      },
      {
        label: 'View Resume',
        href: 'https://drive.google.com/file/d/1gYT0gGjeS0-VmiJIcGpjmvRVNnhz4O_S/view?usp=drive_link',
        external: true,
        download: false,
        variant: 'secondary',
      },
      {
        label: 'Case Studies',
        href: '#case-studies',
        external: false,
        variant: 'secondary',
      },
      {
        label: 'Motion Work',
        href: '#motion',
        external: false,
        variant: 'secondary',
      },
      {
        label: 'Services',
        href: '#services',
        external: false,
        variant: 'secondary',
      },
      {
        label: "Let's Work Together",
        href: '#contact',
        external: false,
        variant: 'secondary',
      },
    ],
    highlights: [
      {
        title: 'Top Highlights',
        company: 'Rhino Creative Agency',
        period: 'Jan - Aug',
        services: [
          'Branding',
          'Graphic Design',
          'Social Creatives',
          'Motion Graphics',
        ],
        stats: [
          {
            value: '25+',
            label: 'Clients',
          },
          {
            value: '1000+',
            label: 'Projects',
          },
        ],
        clients: ['Tata Steel', 'Coromandel', 'Mizaj', 'And more'],
        quote: "Designing for global brands is a rewarding challenge. Every project is an opportunity to craft visuals that not only look spectacular but also drive real business impact.",
        note: 'Delivered high-converting visual systems and campaign assets for top-tier international brands.',
        linkedIn: 'https://www.linkedin.com/in/harishankar-k-1072b5232/',
      },
      
    ],
  },
  sections: {
    services: {
      id: 'services',
      eyebrow: 'Expertise & Services',
      title: 'End-to-end visual design support for growing brands.',
      body: 'I partner with forward-thinking businesses to establish a clear, cohesive visual language that translates seamlessly across all touchpoints.',
      items: [
        {
          title: 'Brand Identity Systems',
          description: 'Comprehensive visual direction, logos, and brand guidelines built for recognizable and scalable communication.',
          number: '01',
        },
        {
          title: 'Premium Packaging Design',
          description: 'Product presentation systems engineered for clarity, brand character, and dominant shelf presence.',
          number: '02',
        },
        {
          title: 'High-Impact Motion Graphics',
          description: 'Dynamic storytelling and animations designed for product launches, campaign explainers, and digital media.',
          number: '03',
        },
        {
          title: 'Social Media Creatives',
          description: 'Flexible, high-converting content architectures tailored for maximum engagement on modern digital channels.',
          number: '04',
        },
        {
          title: 'Marketing Collaterals',
          description: 'Polished print and digital assets—brochures, posters, and banners—that maintain absolute brand consistency.',
          number: '05',
        },
        {
          title: 'Campaign Visual Direction',
          description: 'Scalable master concepts that adapt beautifully across digital, print, and physical point-of-sale environments.',
          number: '06',
        },
      ],
    },
    'case-studies': {
      id: 'case-studies',
      eyebrow: 'Featured Case Studies',
      title: 'Strategic design work that drives results.',
      body: 'A deep dive into how I approach complex communication challenges and develop practical, high-impact design solutions.',
      items: [
        {
         title: 'Durashine Supreme Tamil Campaign',
          category: 'Social Media & Regional Marketing Campaign',
          thumbnail: 'https://drive.google.com/thumbnail?id=KlVS3sWclFTRZpVNwcmc0F3anhjZUhnSDdEb3ombPRVM&sz=w1600',
          challenge: 'Create a culturally relevant campaign that promotes Durashine Supreme roofing solutions while standing out in crowded social feeds. The communication needed to connect with Tamil-speaking audiences and showcase both product quality and aspirational home-building goals.',
  goal: 'Develop a visually engaging regional-language campaign that combines product credibility, emotional appeal, and clear messaging to increase brand awareness and audience engagement.',
  process: [
    'Regional content strategy',
    'Tamil copywriting',
    'Visual concept development',
    'Product and lifestyle integration',
    'Social media adaptations'
  ],
  output: 'Campaign key visuals, Tamil social media creatives, promotional assets, and platform-specific digital adaptations highlighting Durashine Supreme roofing and cladding solutions.',
  result: 'Delivered a cohesive regional campaign system that improved audience engagement, strengthened brand recall, and created a recognizable visual identity across multiple social media formats.'
},
        {
          title: 'Real Estate Campaign Visuals',
          category: 'Campaign and marketing',
          thumbnail: 'https://drive.google.com/thumbnail?id=3MnYyc2XtA3XDpHekRTRWJGdf9mWzR2UpVkMzo1U3QUM&sz=w1600',
          challenge: 'Translate a property-focused message into polished marketing visuals that quickly communicate value.',
          goal: 'Balance information, aspiration, and brand consistency across campaign touchpoints.',
          process: ['Content hierarchy', 'Layout development', 'Format rollout'],
          output: 'Social creatives, campaign layouts, banners, and supporting marketing materials.',
          result: 'A flexible visual direction built for clear communication across digital and display formats.',
        },
        {
  title: 'Gromor Nano DAP USP Animation',
  category: 'Motion Graphics & Product Marketing',
  thumbnail: 'https://drive.google.com/thumbnail?id=xklUkFEU5k1Z58lejdTa40mYqNkdSJneRhlVrlDOaNWM&sz=w1600',
  type: 'video',
  id: 'xklUkFEU5k1Z58lejdTa40mYqNkdSJneRhlVrlDOaNWM',
  href: 'https://drive.google.com/file/d/xklUkFEU5k1Z58lejdTa40mYqNkdSJneRhlVrlDOaNWM/view?usp=drive_link',
  challenge: 'Communicate the unique benefits of Gromor Nano DAP in a simple and engaging format that could quickly educate farmers while maintaining brand consistency across regional markets.',
  goal: 'Create a visually appealing animated explainer that demonstrates product effectiveness, highlights key USPs, and improves audience understanding through clear storytelling.',
  process: [
    'USP breakdown and content structuring',
    'Storyboard development',
    'Illustration and asset creation',
    '2D motion graphics animation',
    'Typography and visual transitions',
    'Final rendering and platform optimization'
  ],
  output: 'Animated product explainer video showcasing Gromor Nano DAP features, benefits, application visuals, and branded motion graphics assets for digital marketing campaigns.',
  result: 'Delivered a concise and engaging motion graphics film that simplified complex product information, strengthened product recall, and provided a scalable communication asset for social media, presentations, and dealer outreach.'
},
      ],
      action: {
        label: 'Explore Full Portfolio',
        href: '#portfolio',
      },
    },
    'client-projects': {
      id: 'client-projects',
      eyebrow: 'Selected Client Work',
      title: 'Key Client Projects',
      items: [
        {
          client: 'Tata BlueScope Steel India',
          bullets: [
            'Designed event branding materials including banners, posters, standees, backdrops, and promotional collaterals for corporate events and exhibitions.',
            'Created offline marketing and retail branding assets for dealer and channel partner promotions.',
            'Developed wall painting artwork concepts and large-format branding creatives.',
            'Designed storefront branding elements including fascia boards, shop signage, and in-store promotional materials.',
            'Contributed to railway station advertising campaigns through large-format outdoor creative designs.',
            'Produced marketing creatives aligned with Tata BlueScope\'s brand guidelines across multiple communication channels.',
          ],
        },
        {
          client: 'Mizaj (India & UAE)',
          bullets: [
            'Designed complete creative assets for new showroom launches and retail store branding initiatives.',
            'Created in-store branding materials including room display graphics, stickers, promotional signage, and visual merchandising elements.',
            'Developed event collaterals and print marketing materials for exhibitions and promotional campaigns.',
            'Designed customer-facing brochures, product catalogues, and marketing literature.',
            'Created internal catalogues and presentation materials for sales and business development teams.',
            'Ensured premium visual communication aligned with the luxury furniture and interior design brand positioning.',
          ],
        },
        {
          client: 'Coromandel International',
          bullets: [
            'Designed advertising creatives for digital and print marketing campaigns.',
            'Created campaign-based promotional materials supporting product marketing initiatives.',
            'Developed motion graphics and animated creatives for marketing communications.',
            'Designed exhibition booth graphics and event branding materials for trade shows and industry events.',
            'Collaborated with marketing teams to deliver visually engaging communication assets while maintaining brand consistency.',
          ],
        },
      ],
    },
    motion: {
      id: 'motion',
      eyebrow: 'Motion Showcase',
      title: 'Movement is part of the first impression.',
      body: 'Selected motion work is embedded here so the pace, transitions, and storytelling can be experienced directly.',
      items: [
        {
          title: 'Dream Alliance Campaign',
          id: 'VR1aYZHcLB1NIB1N4JkSzZnNThWe2QWSIBzS0l3YSBXM',
        },
        {
          title: 'Brand Motion Edit',
          id: 'zkUTwJjWr5WUJZjeq91R3gnMnJnUJRFT0MEWy5UO6pUM',
        },
      ],
    },
    about: {
      id: 'about',
      eyebrow: 'About Me',
      name: 'Harishankar K',
      title: 'I design visual systems that speak with clarity and purpose.',
      body: 'I am a highly driven hybrid visual designer specializing in branding, packaging, social creatives, and motion-led storytelling. I pride myself on bridging the gap between strategic thinking and aesthetic excellence—helping ambitious brands communicate with absolute confidence across both digital and physical spaces.',
      portrait: '',
      facts: [
        { value: '2+', label: 'Years Experience' },
        { value: '25+', label: 'Global Brands' },
        { value: 'Hybrid', label: 'Design Approach' },
      ],
    },
    experience: {
      id: 'experience',
      eyebrow: 'Experience',
      title: 'Proven impact across agencies and growing brands.',
      items: [
        {
          company: 'Aranyakaa Farms',
          role: 'Graphic Designer',
          period: 'Sep 2025 - Present',
          points: [
            'Engineered comprehensive brand identity systems and premium packaging, elevating product perception and market positioning.',
            'Directed high-impact social media campaigns that consistently outperformed core marketing objectives.',
          ],
        },
        {
          company: 'Elegance Enterprises',
          role: 'Graphic Designer',
          period: 'Sep 2025 - Present',
          points: [
            'Governed the visual direction across diverse property and retail portfolios, enforcing rigorous brand consistency.',
            'Architected high-converting marketing collateral and visual assets that drove measurable regional campaign growth.',
          ],
        },
        {
          company: 'Rhino Creative Agency',
          role: 'Graphic Designer',
          period: 'Jul 2024 - Aug 2025',
          points: [
            'Collaborated with top-tier international brands to deliver premium, conversion-focused campaign visuals.',
            'Conceptualized and executed dynamic motion graphics that dramatically improved digital engagement metrics.',
          ],
        },
        {
          company: 'F Gears (Uber Fashion)',
          role: 'Motion Graphics Designer',
          period: 'Dec 2023 - Mar 2024',
          points: [
            'Designed fast-paced, engaging motion sequences that amplified product storytelling and lifestyle marketing.',
            'Developed scalable motion templates that significantly accelerated cross-platform social media content production.',
          ],
        },
        {
          company: 'Talentship',
          role: 'UI/UX Design Intern',
          period: 'Jul 2023 - Oct 2023',
          points: [
            'Designed and prototyped responsive, user-centered interfaces and digital layouts using Figma and web technologies.',
            'Collaborated on front-end implementations with clean HTML and CSS, bridging the gap between static graphics and functional web products.',
          ],
        },
      ],
    },
    skills: {
      id: 'skills',
      eyebrow: 'Skills & Tools',
      title: 'Tools that support my visual workflow.',
      categories: [
        {
          name: 'Motion & 3D Production',
          items: [
            'Adobe After Effects',
            'Adobe Premiere Pro',
            'Cinema 4D',
            'Autodesk Maya',
            'Silhouette (Roto/Paint)',
          ],
        },
        {
          name: 'Vector & Graphic Design',
          items: [
            'Adobe Photoshop',
            'Adobe Illustrator',
            'Figma',
          ],
        },
        {
          name: 'Web & UI Design',
          items: [
            'HTML & CSS',
            'Web Design',
          ],
        },
      ],
    },
    brands: {
      id: 'brands',
      eyebrow: 'Collaborations',
      title: 'Brands I collaborate with.',
      body: 'A ranked client and collaboration list across India, Dubai, Germany, and Canada, spanning industrial brands, retail, real estate, agencies, architecture, agriculture, and lifestyle businesses.',
      items: [
        {
          name: 'Tata BlueScope Steel',
          logo: 'TS',
          logoUrl: '/logos/tata_bluescope_steel.png',
          linkedIn: 'https://in.linkedin.com/company/tatabluescopesteel',
          location: 'India',
          type: 'Steel & Industrial',
        },
        {
          name: 'Aranyakaa Farms',
          logo: 'AF',
          logoUrl: '/logos/aranyakaa_farms.png',
          linkedIn: 'https://in.linkedin.com/company/aranyakaa-farms',
          location: 'India',
          type: 'Agri-Realty',
        },
        {
          name: 'Coromandel International',
          logo: 'CF',
          logoUrl: '/logos/coromandel_international.png',
          linkedIn: 'https://www.linkedin.com/company/global-business-coromandel-international-limited',
          location: 'India',
          type: 'Agri-Solutions',
        },
        {
          name: 'G Square',
          logo: 'GS',
          logoUrl: '/logos/g_square.png',
          linkedIn: 'https://in.linkedin.com/company/gsquarehousing',
          location: 'India',
          type: 'Real Estate',
        },
        {
          name: 'Mizaj',
          logo: 'MZ',
          logoUrl: '/logos/mizaj.png',
          linkedIn: 'https://in.linkedin.com/company/mizajofficial',
          location: 'India & Dubai',
          type: 'Fashion & Lifestyle',
        },
        {
          name: 'Elegance Enterprises',
          logo: 'EE',
          logoUrl: '/logos/elegance_enterprises.png',
          linkedIn: 'https://in.linkedin.com/company/elegance-enterprises1',
          location: 'India',
          type: 'Property & Retail',
        },
        {
          name: 'Namma Markt',
          logo: 'NM',
          logoUrl: '/logos/namma_markt.png',
          location: 'Germany',
          type: 'Retail Grocery',
        },
        {
          name: 'SalesLeadIT',
          logo: 'SL',
          logoUrl: '/logos/salesleadit.png',
          location: 'Canada',
          type: 'Technology',
        },
        {
          name: 'Pondy Thanga Maaligai',
          logo: 'PT',
          logoUrl: '/logos/pondy_thanga_maaligai.png',
          location: 'India',
          type: 'Retail & Jewellery',
        },
        {
          name: 'Darzee',
          logo: 'DZ',
          logoUrl: '/logos/darzee.png',
          linkedIn: 'https://in.linkedin.com/company/darzee-app',
          location: 'India',
          type: 'Fashion & Tech',
        },
        {
          name: 'Baddies',
          logo: 'BD',
          logoUrl: '/logos/baddies.png',
          location: 'Dubai',
          type: 'Fashion & Apparel',
        },
        {
          name: 'Dream Alliance',
          logo: 'DA',
          logoUrl: '/logos/dream_alliance.png',
          location: 'India',
          type: 'Business Group',
        },
        {
          name: 'ID Architects',
          logo: 'ID',
          logoUrl: '/logos/id_architects.png',
          location: 'India',
          type: 'Architecture',
        },
        {
          name: 'Nichi',
          logo: 'NI',
          logoUrl: '/logos/nichi.png',
          location: 'India',
          type: 'Lifestyle Brand',
        },
        {
          name: 'Vlykit Solutions',
          logo: 'VI',
          logoUrl: '/logos/vlykit_solutions.png',
          location: 'India',
          type: 'Creative Agency',
        },
        {
          name: 'SPDS',
          logo: 'SP',
          logoUrl: '/logos/spds.png',
          location: 'India',
          type: 'Business Services',
        },
        {
          name: 'Kerala Secrets',
          logo: 'KS',
          logoUrl: '/logos/kerala_secrets.png',
          location: 'India',
          type: 'Food & Lifestyle',
        },
        {
          name: 'Crafts by Elegance',
          logo: 'CE',
          logoUrl: '/logos/crafts_by_elegance.png',
          location: 'India',
          type: 'Art & Crafts',
        },
        {
          name: 'Nasagri',
          logo: 'NA',
          logoUrl: '/logos/nasagri.png',
          location: 'India',
          type: 'Agri-Tech',
        },
        {
          name: 'Club Aranyakaa',
          logo: 'CA',
          logoUrl: '/logos/club_aranyakaa.png',
          location: 'India',
          type: 'Leisure & Community',
        },
        {
          name: 'Elegance Prime Real Estate',
          logo: 'EP',
          logoUrl: '/logos/elegance_prime_real_estate.png',
          location: 'India',
          type: 'Real Estate',
        },
      ],
    },
    testimonials: {
      id: 'testimonials',
      eyebrow: 'Client Feedback',
      title: 'What clients and partners say.',
      items: [
        {
          quote: "Harishankar's ability to seamlessly bridge static branding and motion graphics is rare. He delivered our campaign assets ahead of schedule and with exceptional design quality.",
          author: "Rajesh Kumar",
          role: "Creative Director",
          company: "Rhino Creative Agency"
        },
        {
          quote: "Working with Harish on our regional campaigns was a breeze. He brought fresh ideas, understood our brand rules, and translated complex agronomy messages into simple visuals.",
          author: "Anjali Sharma",
          role: "Marketing Manager",
          company: "Coromandel International"
        }
      ]
    },
    contact: {
      id: 'contact',
      eyebrow: 'Contact',
      title: "Let's build visuals that speak with purpose.",
      items: [
        {
          label: 'Email',
          value: 'k.harish2323@gmail.com',
          href: 'mailto:k.harish2323@gmail.com',
        },
        {
          label: 'Phone',
          value: '+91 99524 55048',
          href: 'tel:+919952455048',
        },
        {
          label: 'Portfolio',
          value: 'behance.net/Harishankar_K',
          href: 'https://www.behance.net/Harishankar_K',
          external: true,
        },
        {
          label: 'LinkedIn',
          value: 'linkedin.com/in/harishankar-k-1072b5232',
          href: 'https://www.linkedin.com/in/harishankar-k-1072b5232/',
          external: true,
        },
      ],
    },
  },
  portfolioPage: {
    id: 'portfolio',
    eyebrow: 'Selected Work',
    title: 'A category-wise look at visual design and motion work.',
    intro:
      'Browse work grouped by format and output type, featuring selected visuals from recent brand and campaign work.',
    categories: drivePortfolioCategories,
  },
}
