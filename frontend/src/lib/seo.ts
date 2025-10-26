export const SITE_NAME = 'RedHat Funding';
export const SITE_URL = 'https://redhatfunding.com';
export const DEFAULT_DESCRIPTION =
  "Secure flexible business funding in under two minutes with RedHat Funding's streamlined application.";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/social-card.png`;
export const DEFAULT_KEYWORDS = [
  'RedHat Funding',
  'business funding',
  'small business capital',
  'working capital loans',
  'merchant cash advance',
  'business line of credit',
];

export interface PageMetadataInput {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
}

export interface PageMetadata {
  title: string;
  description: string;
  url: string;
  image: string;
  keywords: string[];
  siteName: string;
}

const formatTitle = (title: string) => {
  const trimmed = title.trim();
  if (!trimmed) {
    return `${SITE_NAME} — Flexible Business Capital`;
  }
  if (trimmed.includes(SITE_NAME)) {
    return trimmed;
  }
  return `${trimmed} — ${SITE_NAME}`;
};

export const buildPageMetadata = (input: PageMetadataInput): PageMetadata => {
  const title = formatTitle(input.title);
  const description = input.description?.trim() || DEFAULT_DESCRIPTION;
  const url = new URL(input.path || '/', SITE_URL).toString();
  const image = input.image ? new URL(input.image, SITE_URL).toString() : DEFAULT_SOCIAL_IMAGE;
  const keywords = input.keywords && input.keywords.length ? input.keywords : DEFAULT_KEYWORDS;

  return {
    title,
    description,
    url,
    image,
    keywords,
    siteName: SITE_NAME,
  };
};

export const businessStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  image: DEFAULT_SOCIAL_IMAGE,
  slogan: 'Flexible funding to keep your business moving.',
  areaServed: 'United States',
  serviceType: 'Working capital and small business funding solutions',
};
