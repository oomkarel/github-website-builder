import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSetting } from '@/hooks/useSiteSettings';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const { data: popupSetting } = useSiteSetting('popup');
  
  const popupSettings = popupSetting?.value as Record<string, any> | undefined;

  useEffect(() => {
    if (!popupSettings?.enabled) return;

    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('promo_popup_shown');
    if (popupShown) return;

    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('promo_popup_shown', 'true');
    }, 3000);

    return () => clearTimeout(timer);
  }, [popupSettings?.enabled]);

  if (!popupSettings?.enabled) return null;

  const title = language === 'id' ? popupSettings.title_id : popupSettings.title_en;
  const content = language === 'id' ? popupSettings.content_id : popupSettings.content_en;
  const buttonText = language === 'id' ? popupSettings.button_text_id : popupSettings.button_text_en;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        {popupSettings.image && (
          <div className="w-full aspect-video rounded-lg overflow-hidden mb-4">
            <img 
              src={popupSettings.image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <p className="text-center text-muted-foreground mb-6">
          {content}
        </p>
        
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link to={popupSettings.button_link || '/hubungi-kami'} onClick={() => setIsOpen(false)}>
              {buttonText}
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}