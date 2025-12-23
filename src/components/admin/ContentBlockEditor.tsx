import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Type, 
  Layout, 
  MousePointerClick,
  Star,
  Video,
  HelpCircle,
  Grid3X3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ImageUploader from './ImageUploader';
import RichTextEditor from './RichTextEditor';
import { cn } from '@/lib/utils';

export type BlockType = 'hero' | 'text' | 'image_gallery' | 'cta' | 'features' | 'testimonial' | 'video' | 'faq';

export interface ContentBlock {
  id: string;
  type: BlockType;
  data: Record<string, any>;
}

interface ContentBlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  language?: 'en' | 'id';
}

const blockTypeConfig: Record<BlockType, { 
  icon: React.ElementType; 
  label: { en: string; id: string }; 
  description: { en: string; id: string };
}> = {
  hero: { 
    icon: Layout, 
    label: { en: 'Hero Section', id: 'Bagian Hero' },
    description: { en: 'Full-width banner with title, subtitle and buttons', id: 'Banner lebar penuh dengan judul, subjudul dan tombol' }
  },
  text: { 
    icon: Type, 
    label: { en: 'Text Content', id: 'Konten Teks' },
    description: { en: 'Rich text content block', id: 'Blok konten teks kaya' }
  },
  image_gallery: { 
    icon: Grid3X3, 
    label: { en: 'Image Gallery', id: 'Galeri Gambar' },
    description: { en: 'Grid of images', id: 'Grid gambar' }
  },
  cta: { 
    icon: MousePointerClick, 
    label: { en: 'Call to Action', id: 'Ajakan Bertindak' },
    description: { en: 'Prominent call to action section', id: 'Bagian ajakan bertindak yang menonjol' }
  },
  features: { 
    icon: Star, 
    label: { en: 'Features Grid', id: 'Grid Fitur' },
    description: { en: 'Grid of features with icons', id: 'Grid fitur dengan ikon' }
  },
  testimonial: { 
    icon: Star, 
    label: { en: 'Testimonial', id: 'Testimoni' },
    description: { en: 'Customer testimonial quote', id: 'Kutipan testimoni pelanggan' }
  },
  video: { 
    icon: Video, 
    label: { en: 'Video', id: 'Video' },
    description: { en: 'YouTube or embedded video', id: 'YouTube atau video tersemat' }
  },
  faq: { 
    icon: HelpCircle, 
    label: { en: 'FAQ', id: 'FAQ' },
    description: { en: 'Frequently asked questions', id: 'Pertanyaan yang sering diajukan' }
  },
};

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function getDefaultBlockData(type: BlockType): Record<string, any> {
  switch (type) {
    case 'hero':
      return { title: '', subtitle: '', background_image: '', primary_button_text: '', primary_button_link: '', secondary_button_text: '', secondary_button_link: '' };
    case 'text':
      return { content: '' };
    case 'image_gallery':
      return { images: [], layout: 'grid' };
    case 'cta':
      return { title: '', description: '', button_text: '', button_link: '', background_color: '' };
    case 'features':
      return { items: [] };
    case 'testimonial':
      return { quote: '', author_name: '', author_title: '', author_image: '' };
    case 'video':
      return { youtube_url: '' };
    case 'faq':
      return { items: [] };
    default:
      return {};
  }
}

interface SortableBlockProps {
  block: ContentBlock;
  children: React.ReactNode;
  onDelete: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function SortableBlock({ block, children, onDelete, isExpanded, onToggleExpand }: SortableBlockProps) {
  const { language } = useLanguage();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = blockTypeConfig[block.type];
  const Icon = config.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border rounded-lg bg-background",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="cursor-grab hover:bg-muted p-1 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          <Icon className="h-5 w-5 text-primary" />
          <span className="font-medium">{config.label[language as 'en' | 'id']}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" onClick={onToggleExpand}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}

// Block-specific editors
function HeroBlockEditor({ data, onChange }: { data: Record<string, any>; onChange: (data: Record<string, any>) => void }) {
  const { language } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{language === 'en' ? 'Title' : 'Judul'}</Label>
          <Input value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} />
        </div>
        <div>
          <Label>{language === 'en' ? 'Subtitle' : 'Subjudul'}</Label>
          <Input value={data.subtitle || ''} onChange={(e) => onChange({ ...data, subtitle: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>{language === 'en' ? 'Background Image' : 'Gambar Latar'}</Label>
        <ImageUploader value={data.background_image || ''} onChange={(url) => onChange({ ...data, background_image: url })} folder="blocks" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{language === 'en' ? 'Primary Button Text' : 'Teks Tombol Utama'}</Label>
          <Input value={data.primary_button_text || ''} onChange={(e) => onChange({ ...data, primary_button_text: e.target.value })} />
        </div>
        <div>
          <Label>{language === 'en' ? 'Primary Button Link' : 'Link Tombol Utama'}</Label>
          <Input value={data.primary_button_link || ''} onChange={(e) => onChange({ ...data, primary_button_link: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{language === 'en' ? 'Secondary Button Text' : 'Teks Tombol Sekunder'}</Label>
          <Input value={data.secondary_button_text || ''} onChange={(e) => onChange({ ...data, secondary_button_text: e.target.value })} />
        </div>
        <div>
          <Label>{language === 'en' ? 'Secondary Button Link' : 'Link Tombol Sekunder'}</Label>
          <Input value={data.secondary_button_link || ''} onChange={(e) => onChange({ ...data, secondary_button_link: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function TextBlockEditor({ data, onChange }: { data: Record<string, any>; onChange: (data: Record<string, any>) => void }) {
  return (
    <RichTextEditor value={data.content || ''} onChange={(content) => onChange({ ...data, content })} />
  );
}

function ImageGalleryBlockEditor({ data, onChange }: { data: Record<string, any>; onChange: (data: Record<string, any>) => void }) {
  const { language } = useLanguage();
  const images = data.images || [];
  
  const addImage = () => {
    onChange({ ...data, images: [...images, ''] });
  };
  
  const updateImage = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    onChange({ ...data, images: newImages });
  };
  
  const removeImage = (index: number) => {
    const newImages = images.filter((_: string, i: number) => i !== index);
    onChange({ ...data, images: newImages });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>{language === 'en' ? 'Layout' : 'Tata Letak'}</Label>
        <Select value={data.layout || 'grid'} onValueChange={(value) => onChange({ ...data, layout: value })}>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
            <SelectItem value="masonry">Masonry</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <Label>{language === 'en' ? 'Images' : 'Gambar'}</Label>
        {images.map((img: string, idx: number) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="flex-1">
              <ImageUploader value={img} onChange={(url) => updateImage(idx, url)} folder="gallery" />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(idx)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addImage}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Add Image' : 'Tambah Gambar'}
        </Button>
      </div>
    </div>
  );
}

function CTABlockEditor({ data, onChange }: { data: Record<string, any>; onChange: (data: Record<string, any>) => void }) {
  const { language } = useLanguage();
  return (
    <div className="space-y-4">
      <div>
        <Label>{language === 'en' ? 'Title' : 'Judul'}</Label>
        <Input value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} />
      </div>
      <div>
        <Label>{language === 'en' ? 'Description' : 'Deskripsi'}</Label>
        <Textarea value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={3} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{language === 'en' ? 'Button Text' : 'Teks Tombol'}</Label>
          <Input value={data.button_text || ''} onChange={(e) => onChange({ ...data, button_text: e.target.value })} />
        </div>
        <div>
          <Label>{language === 'en' ? 'Button Link' : 'Link Tombol'}</Label>
          <Input value={data.button_link || ''} onChange={(e) => onChange({ ...data, button_link: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function FeaturesBlockEditor({ data, onChange }: { data: Record<string, any>; onChange: (data: Record<string, any>) => void }) {
  const { language } = useLanguage();
  const items = data.items || [];
  
  const addItem = () => {
    onChange({ ...data, items: [...items, { icon: '', title: '', description: '' }] });
  };
  
  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };
  
  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-4">
      {items.map((item: any, idx: number) => (
        <div key={idx} className="p-4 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{language === 'en' ? 'Feature' : 'Fitur'} {idx + 1}</span>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>{language === 'en' ? 'Icon (Lucide name)' : 'Ikon (nama Lucide)'}</Label>
              <Input value={item.icon || ''} onChange={(e) => updateItem(idx, 'icon', e.target.value)} placeholder="Star, Shield, Zap..." />
            </div>
            <div>
              <Label>{language === 'en' ? 'Title' : 'Judul'}</Label>
              <Input value={item.title || ''} onChange={(e) => updateItem(idx, 'title', e.target.value)} />
            </div>
          </div>
          <div>
            <Label>{language === 'en' ? 'Description' : 'Deskripsi'}</Label>
            <Textarea value={item.description || ''} onChange={(e) => updateItem(idx, 'description', e.target.value)} rows={2} />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4 mr-2" />
        {language === 'en' ? 'Add Feature' : 'Tambah Fitur'}
      </Button>
    </div>
  );
}

function TestimonialBlockEditor({ data, onChange }: { data: Record<string, any>; onChange: (data: Record<string, any>) => void }) {
  const { language } = useLanguage();
  return (
    <div className="space-y-4">
      <div>
        <Label>{language === 'en' ? 'Quote' : 'Kutipan'}</Label>
        <Textarea value={data.quote || ''} onChange={(e) => onChange({ ...data, quote: e.target.value })} rows={3} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{language === 'en' ? 'Author Name' : 'Nama Penulis'}</Label>
          <Input value={data.author_name || ''} onChange={(e) => onChange({ ...data, author_name: e.target.value })} />
        </div>
        <div>
          <Label>{language === 'en' ? 'Author Title/Position' : 'Jabatan Penulis'}</Label>
          <Input value={data.author_title || ''} onChange={(e) => onChange({ ...data, author_title: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>{language === 'en' ? 'Author Image' : 'Foto Penulis'}</Label>
        <ImageUploader value={data.author_image || ''} onChange={(url) => onChange({ ...data, author_image: url })} folder="testimonials" />
      </div>
    </div>
  );
}

function VideoBlockEditor({ data, onChange }: { data: Record<string, any>; onChange: (data: Record<string, any>) => void }) {
  const { language } = useLanguage();
  return (
    <div className="space-y-4">
      <div>
        <Label>{language === 'en' ? 'YouTube URL' : 'URL YouTube'}</Label>
        <Input value={data.youtube_url || ''} onChange={(e) => onChange({ ...data, youtube_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'en' ? 'Paste the full YouTube video URL' : 'Tempel URL lengkap video YouTube'}
        </p>
      </div>
    </div>
  );
}

function FAQBlockEditor({ data, onChange }: { data: Record<string, any>; onChange: (data: Record<string, any>) => void }) {
  const { language } = useLanguage();
  const items = data.items || [];
  
  const addItem = () => {
    onChange({ ...data, items: [...items, { question: '', answer: '' }] });
  };
  
  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };
  
  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-4">
      {items.map((item: any, idx: number) => (
        <div key={idx} className="p-4 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{language === 'en' ? 'Question' : 'Pertanyaan'} {idx + 1}</span>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div>
            <Label>{language === 'en' ? 'Question' : 'Pertanyaan'}</Label>
            <Input value={item.question || ''} onChange={(e) => updateItem(idx, 'question', e.target.value)} />
          </div>
          <div>
            <Label>{language === 'en' ? 'Answer' : 'Jawaban'}</Label>
            <Textarea value={item.answer || ''} onChange={(e) => updateItem(idx, 'answer', e.target.value)} rows={3} />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4 mr-2" />
        {language === 'en' ? 'Add FAQ Item' : 'Tambah Item FAQ'}
      </Button>
    </div>
  );
}

function BlockEditor({ block, onChange }: { block: ContentBlock; onChange: (data: Record<string, any>) => void }) {
  switch (block.type) {
    case 'hero':
      return <HeroBlockEditor data={block.data} onChange={onChange} />;
    case 'text':
      return <TextBlockEditor data={block.data} onChange={onChange} />;
    case 'image_gallery':
      return <ImageGalleryBlockEditor data={block.data} onChange={onChange} />;
    case 'cta':
      return <CTABlockEditor data={block.data} onChange={onChange} />;
    case 'features':
      return <FeaturesBlockEditor data={block.data} onChange={onChange} />;
    case 'testimonial':
      return <TestimonialBlockEditor data={block.data} onChange={onChange} />;
    case 'video':
      return <VideoBlockEditor data={block.data} onChange={onChange} />;
    case 'faq':
      return <FAQBlockEditor data={block.data} onChange={onChange} />;
    default:
      return null;
  }
}

export default function ContentBlockEditor({ blocks, onChange }: ContentBlockEditorProps) {
  const { language } = useLanguage();
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      data: getDefaultBlockData(type),
    };
    onChange([...blocks, newBlock]);
    setExpandedBlocks(prev => new Set([...prev, newBlock.id]));
    setShowAddMenu(false);
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const updateBlockData = (id: string, data: Record<string, any>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, data } : b)));
  };

  const toggleExpand = (id: string) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onDelete={() => deleteBlock(block.id)}
                isExpanded={expandedBlocks.has(block.id)}
                onToggleExpand={() => toggleExpand(block.id)}
              >
                <BlockEditor
                  block={block}
                  onChange={(data) => updateBlockData(block.id, data)}
                />
              </SortableBlock>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{language === 'en' ? 'No content blocks yet' : 'Belum ada blok konten'}</p>
          <p className="text-sm">{language === 'en' ? 'Click the button below to add your first block' : 'Klik tombol di bawah untuk menambahkan blok pertama'}</p>
        </div>
      )}

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Add Content Block' : 'Tambah Blok Konten'}
        </Button>

        {showAddMenu && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
            <CardContent className="p-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(Object.keys(blockTypeConfig) as BlockType[]).map((type) => {
                  const config = blockTypeConfig[type];
                  const Icon = config.icon;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => addBlock(type)}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors text-center"
                    >
                      <Icon className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">{config.label[language as 'en' | 'id']}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}