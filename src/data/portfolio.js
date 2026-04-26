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
    { id: 'brands', label: 'Brands' },
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
      // {
      //   title: 'Approach',
      //   body: 'Blending strategy and aesthetics to make each brand story visually distinct.',
      // },
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
    brands: {
      id: 'brands',
      eyebrow: 'Collaborations',
      title: 'Brands I collaborate with.',
      body: 'A growing mix of farm, fashion, agency, and product-led teams I support with identity, campaign, packaging, and motion design.',
      items: [
        {
          name: 'Aranyakaa Farms',
          type: 'Branding and packaging',
        },
        {
          name: 'Elegance Enterprises',
          type: 'Brand identity',
        },
        {
          name: 'Rhino Creative Agency',
          type: 'Campaign visuals',
        },
        {
          name: 'F Gears',
          type: 'Motion graphics',
        },
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
        images: [
          'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1607703703520-bb638e84caf2?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=900&q=80',
        ],
      },
      {
        title: 'Brochure and Pamphlets',
        count: 4,
        aspect: 'portrait',
        images: [
          'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
        ],
      },
      {
        title: 'Hoarding',
        count: 3,
        aspect: 'landscape',
        images: [
          'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Motion Graphics',
        count: 5,
        aspect: 'video',
        images: [
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Animation',
        count: 4,
        aspect: 'video',
        images: [
          'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Packages',
        count: 5,
        aspect: 'portrait',
        images: [
          'https://images.unsplash.com/photo-1607344645866-009c320f204f?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80',
        ],
      },
    ],
  },
}
