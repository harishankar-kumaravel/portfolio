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
          company: 'Rhino Creative Agency',
          role: 'Graphic Designer',
          period: 'Jul 2024 - Aug 2025',
          points: [
            'Worked with global brands on campaign visuals and creative deliverables.',
            'Developed motion graphics and supporting digital assets.',
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
    title: 'A closer look at brand, campaign, and motion projects.',
    intro:
      'A curated collection of work spanning identity design, packaging, digital campaigns, and motion-first storytelling.',
    projects: [
      {
        title: 'Aranyakaa Product Identity',
        category: 'Branding and Packaging',
        year: '2025',
        description:
          'Built a grounded visual identity and packaging system designed to communicate craft, freshness, and trust across product touchpoints.',
        services: ['Logo Direction', 'Packaging Design', 'Brand Collateral'],
        outcome:
          'Created a more premium shelf presence and a more recognizable visual language across launch assets.',
      },
      {
        title: 'Global Campaign Visuals',
        category: 'Agency Campaign Design',
        year: '2024',
        description:
          'Designed campaign graphics for international clients, adapting brand systems into high-impact digital content for multiple markets.',
        services: ['Campaign Design', 'Digital Creatives', 'Social Media Assets'],
        outcome:
          'Delivered flexible campaign kits that supported faster rollout across channels and formats.',
      },
      {
        title: 'Motion Storytelling Series',
        category: 'Motion Graphics',
        year: '2025',
        description:
          'Produced motion-led visual assets that turned static brand narratives into short, engaging content for online promotion.',
        services: ['Motion Design', 'Storyboard Support', 'Animated Social Content'],
        outcome:
          'Expanded campaign storytelling with movement, pacing, and stronger attention capture in digital spaces.',
      },
    ],
  },
}
