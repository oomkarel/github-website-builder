import { useParams } from 'react-router-dom';
import { useCustomPageBySlugRootLevel } from '@/hooks/useCustomPages';
import CustomPage from '@/pages/CustomPage';
import NotFound from '@/pages/NotFound';
import { Loader2 } from 'lucide-react';

/**
 * Dynamic router that checks if a slug exists in custom_pages table with use_prefix = false.
 * Only serves root-level pages (e.g., /katalog).
 * If page exists and is published with use_prefix = false, renders CustomPage.
 * If not found, renders the NotFound page.
 */
export default function DynamicPageRouter() {
  const { slug } = useParams();
  const { data: page, isLoading, error } = useCustomPageBySlugRootLevel(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If page exists with use_prefix = false, render it
  if (page && !error) {
    return <CustomPage />;
  }

  // Otherwise show 404
  return <NotFound />;
}
