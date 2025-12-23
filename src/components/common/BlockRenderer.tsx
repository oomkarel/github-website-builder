import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { icons } from 'lucide-react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

interface ContentBlock {
  id: string;
  type: string;
  data: Record<string, any>;
}

interface BlockRendererProps {
  blocks: ContentBlock[];
}

function HeroBlock({ data }: { data: Record<string, any> }) {
  return (
    <section 
      className="relative py-20 px-6 min-h-[400px] flex items-center justify-center text-center"
      style={{
        backgroundImage: data.background_image ? `url(${data.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {data.background_image && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div className="relative z-10 max-w-4xl mx-auto">
        {data.title && (
          <h1 className={cn(
            "text-4xl md:text-5xl font-bold mb-4",
            data.background_image ? "text-white" : "text-foreground"
          )}>
            {data.title}
          </h1>
        )}
        {data.subtitle && (
          <p className={cn(
            "text-xl mb-8",
            data.background_image ? "text-white/90" : "text-muted-foreground"
          )}>
            {data.subtitle}
          </p>
        )}
        {(data.primary_button_text || data.secondary_button_text) && (
          <div className="flex flex-wrap gap-4 justify-center">
            {data.primary_button_text && (
              <Button size="lg" asChild>
                <Link to={data.primary_button_link || '#'}>{data.primary_button_text}</Link>
              </Button>
            )}
            {data.secondary_button_text && (
              <Button size="lg" variant="outline" asChild className={data.background_image ? "bg-white/10 border-white text-white hover:bg-white/20" : ""}>
                <Link to={data.secondary_button_link || '#'}>{data.secondary_button_text}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function TextBlock({ data }: { data: Record<string, any> }) {
  if (!data.content) return null;
  return (
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }} />
      </div>
    </section>
  );
}

function ImageGalleryBlock({ data }: { data: Record<string, any> }) {
  const images = data.images || [];
  if (images.length === 0) return null;

  const layoutClasses = {
    grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
    carousel: 'flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4',
    masonry: 'columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4',
  };

  return (
    <section className="py-12 px-6">
      <div className={cn("max-w-6xl mx-auto", layoutClasses[data.layout as keyof typeof layoutClasses] || layoutClasses.grid)}>
        {images.map((img: string, idx: number) => (
          <div key={idx} className={cn(
            "overflow-hidden rounded-lg",
            data.layout === 'carousel' && "flex-shrink-0 w-72 snap-start",
            data.layout === 'masonry' && "break-inside-avoid"
          )}>
            <img 
              src={img} 
              alt={`Gallery image ${idx + 1}`} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function CTABlock({ data }: { data: Record<string, any> }) {
  return (
    <section className="py-16 px-6 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        {data.title && (
          <h2 className="text-3xl font-bold mb-4">{data.title}</h2>
        )}
        {data.description && (
          <p className="text-lg mb-8 opacity-90">{data.description}</p>
        )}
        {data.button_text && (
          <Button size="lg" variant="secondary" asChild>
            <Link to={data.button_link || '#'}>{data.button_text}</Link>
          </Button>
        )}
      </div>
    </section>
  );
}

function FeaturesBlock({ data }: { data: Record<string, any> }) {
  const items = data.items || [];
  if (items.length === 0) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any, idx: number) => {
            const IconComponent = item.icon && (icons as any)[item.icon];
            return (
              <Card key={idx} className="text-center">
                <CardContent className="pt-6">
                  {IconComponent && (
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  {item.title && (
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  )}
                  {item.description && (
                    <p className="text-muted-foreground">{item.description}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialBlock({ data }: { data: Record<string, any> }) {
  if (!data.quote) return null;
  
  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-3xl mx-auto text-center">
        <blockquote className="text-2xl italic text-foreground mb-6">
          "{data.quote}"
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          {data.author_image && (
            <img 
              src={data.author_image} 
              alt={data.author_name} 
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div className="text-left">
            {data.author_name && (
              <div className="font-semibold">{data.author_name}</div>
            )}
            {data.author_title && (
              <div className="text-sm text-muted-foreground">{data.author_title}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoBlock({ data }: { data: Record<string, any> }) {
  if (!data.youtube_url) return null;
  
  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };
  
  const videoId = getYouTubeId(data.youtube_url);
  if (!videoId) return null;

  return (
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}

function FAQBlock({ data }: { data: Record<string, any> }) {
  const items = data.items || [];
  if (items.length === 0) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {items.map((item: any, idx: number) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// Legacy HTML block support
function HTMLBlock({ data }: { data: Record<string, any> }) {
  if (!data.content) return null;
  return (
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }} />
      </div>
    </section>
  );
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="block-renderer">
      {blocks.map((block) => {
        switch (block.type) {
          case 'hero':
            return <HeroBlock key={block.id} data={block.data} />;
          case 'text':
            return <TextBlock key={block.id} data={block.data} />;
          case 'image_gallery':
            return <ImageGalleryBlock key={block.id} data={block.data} />;
          case 'cta':
            return <CTABlock key={block.id} data={block.data} />;
          case 'features':
            return <FeaturesBlock key={block.id} data={block.data} />;
          case 'testimonial':
            return <TestimonialBlock key={block.id} data={block.data} />;
          case 'video':
            return <VideoBlock key={block.id} data={block.data} />;
          case 'faq':
            return <FAQBlock key={block.id} data={block.data} />;
          case 'html':
            return <HTMLBlock key={block.id} data={block.data} />;
          default:
            return null;
        }
      })}
    </div>
  );
}