/**
 * Author information for EEAT (Experience, Expertise, Authoritativeness, Trustworthiness)
 */
export interface Author {
  name: string;
  title: string;
  location: string;
  bio: string;
  expertise: string[];
  experience: string;
  credentials: string[];
  socialProfiles: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  image: string;
}

/**
 * Primary author for all reviews
 */
export const primaryAuthor: Author = {
  name: 'Sam Xu',
  title: 'Melbourne AI Expert',
  location: 'Melbourne, Australia',
  bio: 'Sam Xu is a Melbourne-based AI specialist with over 8 years of experience in fintech and AI tool evaluation. He has researched 100+ investment tools and helps traders and investors choose the right technology for their needs.',
  expertise: [
    'AI Investment Signals',
    'Quantitative Platforms',
    'Fintech Infrastructure',
    'Portfolio Management',
    'Crypto Tools',
  ],
  experience: '8+ years in fintech and AI',
  credentials: [
    'Certified AI Specialist',
    'Former Fintech Product Lead',
    'Contributed to Forbes, Entrepreneur, and TechCrunch',
    'Researched 100+ investment tools',
  ],
  socialProfiles: {
    twitter: 'https://twitter.com/FeynmanXu',
    linkedin: 'https://www.linkedin.com/in/xiaobin-xu-0a7065b4/',
    github: 'https://github.com/feynmanxu',
    website: 'https://aitoolreviews.com/about',
  },
  image: '/images/authors/sam-xu.jpg',
};

/**
 * Generate author schema for JSON-LD
 */
export function getAuthorSchema(author: Author = primaryAuthor) {
  return {
    '@type': 'Person',
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    url: author.socialProfiles.website,
    image: author.image,
    sameAs: [
      author.socialProfiles.twitter,
      author.socialProfiles.linkedin,
      author.socialProfiles.github,
    ].filter(Boolean),
    knowsAbout: author.expertise,
    address: {
      '@type': 'PostalAddress',
      addressLocality: author.location.split(',')[0]?.trim(),
      addressCountry: 'Australia',
    },
  };
}

/**
 * Get author display string
 */
export function getAuthorByline(author: Author = primaryAuthor): string {
  return `Reviewed by ${author.name}, ${author.title}`;
}
