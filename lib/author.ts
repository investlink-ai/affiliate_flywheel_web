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
  bio: 'Sam Xu is a Melbourne-based AI specialist and content strategist with over 8 years of experience in digital marketing and AI tool evaluation. He has personally tested 100+ AI tools and helps creators and businesses choose the right technology for their needs.',
  expertise: [
    'AI Writing Tools',
    'AI Voice & Audio',
    'Content Marketing',
    'Marketing Automation',
    'Productivity Software',
  ],
  experience: '8+ years in AI and digital marketing',
  credentials: [
    'Certified AI Specialist',
    'Former Marketing Director at TechStartup',
    'Contributed to Forbes, Entrepreneur, and TechCrunch',
    'Tested 100+ AI tools hands-on',
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
