import { useParams } from 'react-router-dom';
import { useCustomPageBySlug } from '@/hooks/useCustomPages';
import CustomPage from '@/pages/CustomPage';
import NotFound from '@/pages/NotFound';
import { Loader2 } from 'lucide-react';

/**
 * Dynamic router that checks if a slug exists in custom_pages table.
 * If it exists and is published, renders the CustomPage component.
 * If not found, renders the NotFound page.
 */
export default function DynamicPageRouter() {
  const { slug } = useParams();
  const { data: page, isLoading, error } = useCustomPageBySlug(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If page exists in custom_pages and is published, render it
  if (page && !error) {
    return <CustomPage />;
  }

  // Otherwise show 404
  return <NotFound />;
}

