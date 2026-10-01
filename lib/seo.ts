import { Metadata } from 'next';

export const siteConfig = {
  name: 'Naag Nool UP',
  tagline: 'The time to be ALIVE is now.',
  description:
    "Naag Nool UP is a universal women's empowerment brand and movement, created to help women live with greater intention, confidence, self-worth and agency.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://naagnoolup.com',
  ogImage: '/assets/og-image.jpg',
};

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonicalUrl,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: title ? `${title} | Naag Nool UP` : `${siteConfig.name} — ${siteConfig.tagline}`,
    description,
    openGraph: {
      title: title ? `${title} | Naag Nool UP` : siteConfig.name,
      description,
      url: canonicalUrl || siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | Naag Nool UP` : siteConfig.name,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
  };
}
