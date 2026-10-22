import { SITE_URL } from './site';

export interface Author {
  name: string;
  description: string;
  url: string;
  socialProfiles: {
    twitter: string;
  };
}

export const primaryAuthor: Author = {
  name: 'InvestLink',
  description: 'We explain what each tool does in plain English. This is general information, not financial advice.',
  url: `${SITE_URL}/about`,
  socialProfiles: {
    twitter: 'https://x.com/investlink_ai',
  },
};

export function getAuthorSchema(author: Author = primaryAuthor) {
  return {
    '@type': 'Organization',
    name: author.name,
    url: author.url,
    sameAs: [author.socialProfiles.twitter],
  };
}

export function getAuthorByline(author: Author = primaryAuthor): string {
  return `Reviewed by ${author.name}`;
}
