export const portfolio = {
  meta: {
    title: 'Harishankar K',
    role: 'Hybrid Visual Designer',
    label: 'Visual Portfolio',
    copyright: '2026 Harishankar K',
  },
  navigation: [
    { id: 'home', label: 'Home', page: 'home' },
    { id: 'portfolio', label: 'Portfolio', page: 'portfolio' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ],
  hero: {
    eyebrow: 'Branding | Graphic Design | Motion Graphics',
    heading: 'Designing brands that feel clear, expressive, and unforgettable.',
    description:
      'I create visual systems, campaign assets, and motion-led storytelling that help businesses communicate with confidence across print and digital spaces.',
    actions: [
      {
        label: 'View Behance',
        href: 'https://www.behance.net/Harishankar_K',
        external: true,
        variant: 'primary',
      },
      {
        label: 'Contact Me',
        href: '#contact',
        external: false,
        variant: 'secondary',
      },
    ],
    highlights: [
      {
        title: 'Focus',
        body: 'Brand identity, packaging design, social campaigns, and motion visuals.',
      },
      {
        title: 'Approach',
        body: 'Blending strategy and aesthetics to make each brand story visually distinct.',
      },
    ],
  },
  sections: {
    about: {
      id: 'about',
      eyebrow: 'About Me',
      title: 'Creative direction rooted in storytelling.',
      body: 'Creative Hybrid Visual Designer specializing in branding, motion graphics, and visual storytelling. Experienced in delivering impactful design solutions across digital and print platforms for global clients.',
    },
    experience: {
      id: 'experience',
      eyebrow: 'Experience',
      title: 'Design work across growing brands and agency environments.',
      items: [
        {
          company: 'Aranyakaa Farms',
          role: 'Graphic Designer',
          period: 'Sep 2025 - Present',
          points: [
            'Brand identity and packaging design for product-led storytelling.',
            'Social media and marketing creatives tailored to campaign goals.',
          ],
        },
        {
          company: 'elegance Enterprises',
          role: 'Graphic Designer',
          period: 'Sep 2025 - Present',
          points: [
            'Brand identity and packaging design for product-led storytelling.',
            'Social media and marketing creatives tailored to campaign goals.',
          ],
        },
        {
          company: 'Rhino Creative Agency',
          role: 'Graphic Designer',
          period: 'Jul 2024 - Aug 2025',
          points: [
            'Worked with global brands on campaign visuals and creative deliverables.',
            'Developed motion graphics and supporting digital assets.',
          ],
        },
        {
          company: 'F Gears (Uber Fashion merchandise pvt ltd)',
          role: 'Motion Graphics Designer',
          period: 'Dec 2023 - Mar 2024',
          points: [
            'Brand identity and packaging design for product-led storytelling.',
            'Social media and marketing creatives tailored to campaign goals.',
          ],
        },
      ],
    },
    skills: {
      id: 'skills',
      eyebrow: 'Skills',
      title: 'Tools that support my visual workflow.',
      items: [
        'Adobe Photoshop',
        'Adobe Illustrator',
        'Adobe After Effects',
        'Adobe Premiere Pro',
        'Figma',
        'Cinema 4D',
        'maya',
        'shillouette', 
      ],
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
      ],
    },
  },
  portfolioPage: {
    id: 'portfolio',
    eyebrow: 'Selected Work',
    title: 'A category-wise look at visual design and motion work.',
    intro:
      'Browse work grouped by format and output type, with placeholders ready to be replaced by final portfolio visuals.',
    categories: [
      {
        title: 'Social Media Creatives',
        count: 6,
        aspect: 'square',
      },
      {
        title: 'Brochure and Pamphlets',
        count: 4,
        aspect: 'portrait',
      },
      {
        title: 'Hoarding',
        count: 3,
        aspect: 'landscape',
      },
      {
        title: 'Motion Graphics',
        count: 5,
        aspect: 'video',
      },
      {
        title: 'Animation',
        count: 4,
        aspect: 'video',
      },
      {
        title: 'Packages',
        count: 5,
        aspect: 'portrait',
      },
    ],
  },
}
