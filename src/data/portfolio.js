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
    eyebrow: 'Brand identities · Campaigns · Motion',
    heading: 'Design that is clear, useful and easy to remember.',
    description:
      'I’m Harishankar, a visual designer working across identity, packaging, campaigns and motion. This portfolio brings together projects made for different brands, audiences and formats.',
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
        quote: "Working with different brands has taught me to ask better questions, understand the audience and make every visual earn its place.",
        note: 'Created campaign systems and everyday marketing assets for clients across several industries.',
        linkedIn: 'https://www.linkedin.com/in/harishankar-k-1072b5232/',
      },
      
    ],
  },
  sections: {
    services: {
      id: 'services',
      eyebrow: 'What I Do',
      title: 'Design support from the first idea to the final file.',
      body: 'I help businesses find a clear visual direction and carry it through the places their customers will see it.',
      items: [
        {
          title: 'Brand Identity Systems',
          description: 'Logos, visual direction and practical brand guidelines that keep communication consistent.',
          number: '01',
        },
        {
          title: 'Packaging Design',
          description: 'Packaging that explains the product clearly and gives it a distinct presence on the shelf.',
          number: '02',
        },
        {
          title: 'Motion Graphics',
          description: 'Animation and visual storytelling for product launches, explainers and digital campaigns.',
          number: '03',
        },
        {
          title: 'Social Media Creatives',
          description: 'Flexible social content that fits the brand and makes the message easy to understand.',
          number: '04',
        },
        {
          title: 'Marketing Collaterals',
          description: 'Brochures, posters, banners and digital assets that feel like part of the same brand.',
          number: '05',
        },
        {
          title: 'Campaign Visual Direction',
          description: 'A strong campaign idea with layouts that work across digital, print and point of sale.',
          number: '06',
        },
      ],
    },
    'case-studies': {
      id: 'case-studies',
      eyebrow: 'Featured Case Studies',
      title: 'The thinking behind the finished work.',
      body: 'A closer look at the brief, the design choices and what I delivered for each project.',
      items: [
        {
         title: 'Durashine Supreme Tamil Campaign',
          category: 'Social Media & Regional Marketing Campaign',
          id: '1X_n10t-vNcCTmmj8Tl6iKrtDfgTKM49j',
          thumbnail: 'https://drive.google.com/thumbnail?id=1X_n10t-vNcCTmmj8Tl6iKrtDfgTKM49j&sz=w1600',
          href: 'https://drive.google.com/file/d/1X_n10t-vNcCTmmj8Tl6iKrtDfgTKM49j/view?usp=sharing',
          challenge: 'Create a Tamil campaign for Durashine Supreme that could stand out on social media, explain the roofing product clearly and connect with people planning a better home.',
  goal: 'Build a regional campaign that felt trustworthy, easy to understand and relevant to Tamil-speaking audiences.',
  process: [
    'Regional content strategy',
    'Tamil copywriting',
    'Visual concept development',
    'Product and lifestyle integration',
    'Social media adaptations'
  ],
  output: 'Campaign key visuals, Tamil social media posts and promotional assets for Durashine Supreme roofing and cladding.',
  result: 'The final system gave the campaign a recognisable look and made it easy to adapt the message for different social formats.'
},
        {
          title: 'Real Estate Campaign Visuals',
          category: 'Campaign and marketing',
          id: '1ptQzrgsl_lJfSfzEXYLQQlnlh11tUd3M',
          thumbnail: 'https://drive.google.com/thumbnail?id=1ptQzrgsl_lJfSfzEXYLQQlnlh11tUd3M&sz=w1600',
          href: 'https://drive.google.com/file/d/1ptQzrgsl_lJfSfzEXYLQQlnlh11tUd3M/view?usp=sharing',
          challenge: 'Turn detailed property information into marketing visuals people could understand at a glance.',
          goal: 'Balance practical information with the feeling of buying a new home, while keeping every format consistent.',
          process: ['Content hierarchy', 'Layout development', 'Format rollout'],
          output: 'Social creatives, campaign layouts, banners, and supporting marketing materials.',
          result: 'A flexible set of layouts that kept the information clear across digital ads, social posts and displays.',
        },
        {
  title: 'Gromor Nano DAP USP Animation',
  category: 'Motion Graphics & Product Marketing',
  thumbnail: 'https://drive.google.com/thumbnail?id=1LIeYQ58uh5JrgM6zrKMlAKlBoNH1-Frc&sz=w1600',
  type: 'video',
  id: '1LIeYQ58uh5JrgM6zrKMlAKlBoNH1-Frc',
  href: 'https://drive.google.com/file/d/1LIeYQ58uh5JrgM6zrKMlAKlBoNH1-Frc/view?usp=drive_link',
  challenge: 'Explain the benefits of Gromor Nano DAP to farmers in a short format while staying within the brand’s visual style.',
  goal: 'Make an animated explainer that showed how the product works and made its main benefits easy to follow.',
  process: [
    'USP breakdown and content structuring',
    'Storyboard development',
    'Illustration and asset creation',
    '2D motion graphics animation',
    'Typography and visual transitions',
    'Final rendering and platform optimization'
  ],
  output: 'An animated product explainer covering Nano DAP features, benefits and application, plus motion assets for digital campaigns.',
  result: 'The finished film turned technical product information into a short visual story that could be used on social media, in presentations and by dealers.'
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
            'Designed banners, posters, standees, backdrops and other material for events and exhibitions.',
            'Created retail and offline marketing work for dealer and channel partner promotions.',
            'Developed wall painting concepts and large-format brand artwork.',
            'Designed fascia boards, shop signs and in-store promotional material.',
            'Created large-format artwork for railway station advertising.',
            'Adapted marketing work across formats while following Tata BlueScope’s brand guidelines.',
          ],
        },
        {
          client: 'Mizaj (India & UAE)',
          bullets: [
            'Designed launch material and store branding for new showrooms.',
            'Created room display graphics, stickers, signs and other in-store material.',
            'Developed print work for exhibitions, events and promotions.',
            'Designed customer brochures, product catalogues and marketing material.',
            'Created internal catalogues and presentations for sales teams.',
            'Kept the work refined and consistent with the furniture brand’s visual style.',
          ],
        },
        {
          client: 'Coromandel International',
          bullets: [
            'Designed advertising for digital and print campaigns.',
            'Created promotional material for product marketing campaigns.',
            'Made motion graphics and animated content for marketing communication.',
            'Designed exhibition booth graphics and event branding for trade shows.',
            'Worked with the marketing team to keep every format clear and consistent with the brand.',
          ],
        },
      ],
    },
    motion: {
      id: 'motion',
      eyebrow: 'Motion Showcase',
      title: 'A selection of motion work.',
      body: 'Play the work here to see how the pacing, transitions and story come together.',
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
      title: 'I design brands, campaigns and motion with a clear purpose.',
      body: 'I’m a visual designer who enjoys turning a complicated brief into something people can understand quickly. My work covers branding, packaging, social content and motion, and I care about making it practical enough to work across both digital and physical formats.',
      portrait: '/profile-photo.png',
      facts: [
        { value: '2+', label: 'Years Experience' },
        { value: '25+', label: 'Global Brands' },
        { value: 'Hybrid', label: 'Design Approach' },
      ],
    },
    experience: {
      id: 'experience',
      eyebrow: 'Experience',
      title: 'Experience across agencies, brands and independent work.',
      items: [
        {
          company: 'Aranyakaa Farms',
          role: 'Graphic Designer',
          period: 'Sep 2025 - Present',
          points: [
            'Built brand identity systems and packaging for new and growing product lines.',
            'Created social media campaigns and day-to-day marketing content.',
          ],
        },
        {
          company: 'Elegance Enterprises',
          role: 'Graphic Designer',
          period: 'Sep 2025 - Present',
          points: [
            'Set the visual direction for property and retail work across several ongoing projects.',
            'Designed marketing material and campaign assets for regional audiences.',
          ],
        },
        {
          company: 'Rhino Creative Agency',
          role: 'Graphic Designer',
          period: 'Jul 2024 - Aug 2025',
          points: [
            'Worked with international clients on campaign visuals across digital and print formats.',
            'Developed motion graphics for product, brand and social media communication.',
          ],
        },
        {
          company: 'F Gears (Uber Fashion)',
          role: 'Motion Graphics Designer',
          period: 'Dec 2023 - Mar 2024',
          points: [
            'Designed short motion pieces for product stories and lifestyle marketing.',
            'Built reusable motion templates for regular social media content.',
          ],
        },
        {
          company: 'Talentship',
          role: 'UI/UX Design Intern',
          period: 'Jul 2023 - Oct 2023',
          points: [
            'Designed and prototyped responsive interfaces and layouts in Figma.',
            'Worked with HTML and CSS to turn static designs into working web pages.',
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
      title: 'Brands I’ve worked with.',
      body: 'A mix of clients from India, Dubai, Germany and Canada, including work in industry, retail, real estate, architecture, agriculture and lifestyle.',
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
        {
          name: 'Insync',
          logo: 'IS',
          logoUrl: '/logos/insync.png',
          location: 'Bangalore',
          type: 'Realty Services',
        },
      ],
    },
    testimonials: {
      id: 'testimonials',
      eyebrow: 'Client Feedback',
      title: 'What it’s like to work with me.',
      items: [
        {
          quote: "Harishankar handled both the static and motion work well. He kept the campaign moving, delivered on time and gave us work we could use straight away.",
          author: "Rajesh Kumar",
          role: "Creative Director",
          company: "Rhino Creative Agency"
        },
        {
          quote: "Harish understood the brief quickly and made the regional content easy to follow. He brought useful ideas, respected the brand and was easy to work with.",
          author: "Anjali Sharma",
          role: "Marketing Manager",
          company: "Coromandel International"
        }
      ]
    },
    contact: {
      id: 'contact',
      eyebrow: 'Contact',
      title: "Have a project in mind? Let's talk.",
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
          value: 'Harishankar_K on Behance',
          href: 'https://www.behance.net/Harishankar_K',
          external: true,
        },
        {
          label: 'LinkedIn',
          value: 'Harishankar K on LinkedIn',
          href: 'https://www.linkedin.com/in/harishankar-k-1072b5232/',
          external: true,
        },
      ],
    },
  },
  portfolioPage: {
    id: 'portfolio',
    eyebrow: 'Selected Work',
    title: 'Browse my design and motion work.',
    intro:
      'Choose a category to see recent brand, campaign, print, social and motion projects.',
    categories: drivePortfolioCategories,
  },
}
