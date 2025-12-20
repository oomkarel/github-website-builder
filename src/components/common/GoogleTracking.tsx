import { Helmet } from 'react-helmet-async';
import { useSiteSetting } from '@/hooks/useSiteSettings';
import { useEffect } from 'react';

interface SeoSettings {
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  google_search_console?: string;
}

export function GoogleTracking() {
  const { data: seoSetting } = useSiteSetting('seo');
  const seo = seoSetting?.value as SeoSettings | undefined;

  const gaId = seo?.google_analytics_id;
  const gtmId = seo?.google_tag_manager_id;
  const gscVerification = seo?.google_search_console;

  // Inject GTM noscript iframe into body
  useEffect(() => {
    if (!gtmId) return;

    const existingNoscript = document.getElementById('gtm-noscript-iframe');
    if (existingNoscript) return;

    const noscript = document.createElement('noscript');
    noscript.id = 'gtm-noscript-iframe';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);

    return () => {
      const el = document.getElementById('gtm-noscript-iframe');
      if (el) el.remove();
    };
  }, [gtmId]);

  if (!gaId && !gtmId && !gscVerification) {
    return null;
  }

  return (
    <Helmet>
      {/* Google Search Console verification */}
      {gscVerification && (
        <meta name="google-site-verification" content={gscVerification} />
      )}

      {/* Google Analytics 4 */}
      {gaId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      )}
      {gaId && (
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </script>
      )}

      {/* Google Tag Manager */}
      {gtmId && (
        <script>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </script>
      )}
    </Helmet>
  );
}
