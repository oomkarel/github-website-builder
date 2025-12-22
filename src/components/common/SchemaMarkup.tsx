import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useLocation } from 'react-router-dom';

interface SchemaMarkupProps {
  type?: 'website' | 'article' | 'organization';
  article?: {
    title: string;
    description: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function SchemaMarkup({ type = 'website', article, breadcrumbs }: SchemaMarkupProps) {
  const { data: settings } = useSiteSettings();
  const location = useLocation();

  const seoSetting = settings?.find(s => s.key === 'seo')?.value as {
    site_url?: string;
    site_name?: string;
    default_description_en?: string;
    default_description_id?: string;
    default_og_image?: string;
  } | undefined;

  const socialSetting = settings?.find(s => s.key === 'social')?.value as {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  } | undefined;

  const contactSetting = settings?.find(s => s.key === 'contact')?.value as {
    email?: string;
    phone?: string;
    address?: string;
  } | undefined;

  const logoSetting = settings?.find(s => s.key === 'logo')?.value as {
    light?: string;
    dark?: string;
  } | undefined;

  const baseUrl = seoSetting?.site_url || 'https://bungkusindonesia.com';
  const siteName = seoSetting?.site_name || 'Bungkus Indonesia';
  const currentUrl = `${baseUrl}${location.pathname}`;

  // Build social links array
  const sameAs: string[] = [];
  if (socialSetting?.instagram) sameAs.push(`https://instagram.com/${socialSetting.instagram.replace('@', '')}`);
  if (socialSetting?.facebook) sameAs.push(socialSetting.facebook.startsWith('http') ? socialSetting.facebook : `https://facebook.com/${socialSetting.facebook}`);
  if (socialSetting?.linkedin) sameAs.push(socialSetting.linkedin.startsWith('http') ? socialSetting.linkedin : `https://linkedin.com/company/${socialSetting.linkedin}`);
  if (socialSetting?.youtube) sameAs.push(socialSetting.youtube.startsWith('http') ? socialSetting.youtube : `https://youtube.com/@${socialSetting.youtube}`);
  if (socialSetting?.twitter) sameAs.push(`https://twitter.com/${socialSetting.twitter.replace('@', '')}`);

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: baseUrl,
    logo: logoSetting?.light || `${baseUrl}/og-image.png`,
    description: seoSetting?.default_description_en || 'Premium packaging solutions for businesses of all sizes',
    email: contactSetting?.email,
    telephone: contactSetting?.phone,
    address: contactSetting?.address ? {
      '@type': 'PostalAddress',
      streetAddress: contactSetting.address,
    } : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // WebPage Schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: currentUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: baseUrl,
    },
  };

  // Article Schema (for blog posts)
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || seoSetting?.default_og_image || `${baseUrl}/og-image.png`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: logoSetting?.light || `${baseUrl}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
  } : null;

  // BreadcrumbList Schema
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`,
    })),
  } : null;

  // Clean undefined values from objects
  const cleanObject = (obj: Record<string, unknown>): Record<string, unknown> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
    );
  };

  return (
    <Helmet>
      {/* Organization Schema - always present */}
      <script type="application/ld+json">
        {JSON.stringify(cleanObject(organizationSchema))}
      </script>

      {/* WebSite Schema - always present */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* WebPage Schema - for regular pages */}
      {type === 'website' && (
        <script type="application/ld+json">
          {JSON.stringify(webPageSchema)}
        </script>
      )}

      {/* Article Schema - for blog posts */}
      {type === 'article' && articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}

      {/* Breadcrumb Schema */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
}
