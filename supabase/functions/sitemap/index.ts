import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
};

// Security-sensitive paths that should NEVER be in sitemap
const EXCLUDED_PATHS = [
  '/admin',
  '/auth',
  '/api',
  '/login',
  '/signup',
  '/dashboard',
  '/reset-password',
];

// Helper function to check if path is security-sensitive
const isSecuritySensitivePath = (path: string): boolean => {
  return EXCLUDED_PATHS.some(excluded => 
    path === excluded || path.startsWith(`${excluded}/`)
  );
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get SEO settings to check if sitemap is enabled and get site URL
    const { data: seoSettings } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'seo')
      .single();

    const seo = seoSettings?.value as {
      sitemap_enabled?: boolean;
      site_url?: string;
    } | null;

    // If sitemap is disabled, return empty response
    if (seo?.sitemap_enabled === false) {
      return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
        headers: corsHeaders,
      });
    }

    const baseUrl = seo?.site_url || 'https://bungkusin.co.id';

    // Get page content for accurate lastmod dates
    const { data: pageContent } = await supabase
      .from('page_content')
      .select('page_key, updated_at');

    // Create a map of page_key to updated_at
    const pageLastMod: Record<string, string> = {};
    if (pageContent) {
      for (const page of pageContent) {
        pageLastMod[page.page_key] = page.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0];
      }
    }

    const today = new Date().toISOString().split('T')[0];

    // Define all static pages with their routes (excluding admin pages)
    const staticPages = [
      { key: 'home', path: '/', priority: '1.0', changefreq: 'weekly' },
      { key: 'about', path: '/tentang-kami', priority: '0.8', changefreq: 'monthly' },
      { key: 'product-catalog', path: '/produk', priority: '0.9', changefreq: 'weekly' },
      { key: 'products', path: '/produk/industri', priority: '0.8', changefreq: 'weekly' },
      { key: 'corporate-solutions', path: '/solusi-korporat', priority: '0.8', changefreq: 'monthly' },
      { key: 'umkm-solutions', path: '/solusi-umkm', priority: '0.8', changefreq: 'monthly' },
      { key: 'case-studies', path: '/case-studies', priority: '0.7', changefreq: 'monthly' },
      { key: 'blog', path: '/blog', priority: '0.8', changefreq: 'daily' },
      { key: 'contact', path: '/hubungi-kami', priority: '0.7', changefreq: 'monthly' },
      { key: 'terms-conditions', path: '/terms', priority: '0.3', changefreq: 'yearly' },
      { key: 'privacy-policy', path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    ];

    // Always include all static pages (no CMS filtering - security paths already excluded from list)
    const indexedPages = staticPages;

    // Get published blog posts
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, updated_at, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    // Get published custom pages with use_prefix field
    const { data: customPages } = await supabase
      .from('custom_pages')
      .select('slug, updated_at, created_at, use_prefix')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages with accurate lastmod from page_content
    for (const page of indexedPages) {
      const lastmod = pageLastMod[page.key] || today;
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Always include all published blog posts
    if (blogs) {
      for (const blog of blogs) {
        const lastmod = blog.updated_at || blog.created_at || today;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/blog/${blog.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod.split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    // Add all published custom pages (filtered only by security, not CMS settings)
    if (customPages) {
      for (const page of customPages) {
        // Determine the full path for this custom page
        const pagePath = page.use_prefix ? `/p/${page.slug}` : `/${page.slug}`;
        
        // Skip security-sensitive paths
        if (isSecuritySensitivePath(pagePath)) {
          console.log(`Skipping security-sensitive path: ${pagePath}`);
          continue;
        }

        const lastmod = page.updated_at || page.created_at || today;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${pagePath}</loc>\n`;
        xml += `    <lastmod>${lastmod.split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += '</urlset>';

    console.log(`Sitemap generated with ${indexedPages.length} static pages, ${blogs?.length || 0} blog posts, and ${customPages?.length || 0} custom pages`);

    return new Response(xml, { headers: corsHeaders });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, {
      headers: corsHeaders,
    });
  }
});
