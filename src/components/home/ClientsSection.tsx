import React, { useRef, useState, memo } from 'react';
import { Building2 } from 'lucide-react';

interface ClientLogo {
  name: string;
  image: string;
}

interface ClientsSectionProps {
  title?: string;
  subtitle?: string;
  logos?: ClientLogo[];
  marqueeSpeed?: 'slow' | 'normal' | 'fast' | 'very-fast';
}

// Memoized LogoCard to prevent unnecessary re-renders
const LogoCard = memo(({ client, variant = 'marquee' }: { client: ClientLogo; variant?: 'marquee' | 'grid' }) => (
  <div
    className={`flex-shrink-0 ${variant === 'marquee' ? 'w-48 h-32 mx-4' : 'w-full h-36'} flex items-center justify-center p-6 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors group`}
  >
    {client.image ? (
      <img
        src={client.image}
        alt={client.name}
        loading="lazy"
        decoding="async"
        width={192}
        height={80}
        className="max-h-20 max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
      />
    ) : (
      <div className={`flex flex-col items-center ${variant === 'marquee' ? 'gap-2' : 'gap-3'} text-muted-foreground group-hover:text-foreground transition-colors`}>
        <Building2 className={variant === 'marquee' ? 'h-10 w-10' : 'h-12 w-12'} />
        <span className="text-sm font-medium text-center">{client.name}</span>
      </div>
    )}
  </div>
));

LogoCard.displayName = 'LogoCard';

const speedMap = {
  'slow': 45,
  'normal': 30,
  'fast': 15,
  'very-fast': 10
};

export function ClientsSection({ title, subtitle, logos, marqueeSpeed = 'normal' }: ClientsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Don't render if no logos provided (CMS not configured)
  if (!logos || logos.length === 0) {
    return null;
  }

  // Calculate how many times to repeat logos for smooth infinite scroll
  // We want at least 8 logo cards visible to fill the viewport
  const minLogosForSmooth = 8;
  const duplicateCount = Math.ceil(minLogosForSmooth / logos.length);
  const expandedLogos = Array(duplicateCount).fill(logos).flat();
  
  // Base speed, adjusted proportionally for number of expanded logos
  const baseSpeed = speedMap[marqueeSpeed] || 30;
  const animationDuration = (expandedLogos.length / 8) * baseSpeed;

  // Touch/mouse handlers for swipe scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Swipeable + auto-scrolling marquee for infinite loop */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              contain: 'content'
            }}
          >
            <div 
              className={`flex ${isDragging ? '' : 'hover:[animation-play-state:paused]'}`}
              style={{ 
                animation: isDragging ? 'none' : `marquee ${animationDuration}s linear infinite`,
                width: 'max-content',
                willChange: 'transform'
              }}
            >
              {/* First set of expanded logos */}
              {expandedLogos.map((client, index) => (
                <LogoCard key={`first-${index}`} client={client} variant="marquee" />
              ))}
              {/* Duplicate set for seamless infinite loop */}
              {expandedLogos.map((client, index) => (
                <LogoCard key={`second-${index}`} client={client} variant="marquee" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
