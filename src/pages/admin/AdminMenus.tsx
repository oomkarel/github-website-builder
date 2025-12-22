import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Loader2, 
  Plus, 
  GripVertical, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  ChevronRight,
  Menu as MenuIcon,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { 
  useNavigationMenus,
  useNavigationMenusHierarchy,
  useCreateNavigationMenu,
  useUpdateNavigationMenu,
  useDeleteNavigationMenu,
  useReorderNavigationMenus,
  NavigationMenu 
} from '@/hooks/useNavigationMenus';
import { cn } from '@/lib/utils';

interface MenuFormData {
  label_en: string;
  label_id: string;
  href: string;
  parent_id: string | null;
  is_visible: boolean;
}

const defaultFormData: MenuFormData = {
  label_en: '',
  label_id: '',
  href: '',
  parent_id: null,
  is_visible: true,
};

export default function AdminMenus() {
  const { language } = useLanguage();
  const { data: hierarchicalMenus, isLoading } = useNavigationMenusHierarchy();
  const { data: flatMenus } = useNavigationMenus();
  const createMenu = useCreateNavigationMenu();
  const updateMenu = useUpdateNavigationMenu();
  const deleteMenu = useDeleteNavigationMenu();
  const reorderMenus = useReorderNavigationMenus();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<NavigationMenu | null>(null);
  const [deleteMenuId, setDeleteMenuId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MenuFormData>(defaultFormData);

  const handleOpenCreate = (parentId?: string) => {
    setEditingMenu(null);
    setFormData({ ...defaultFormData, parent_id: parentId || null });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (menu: NavigationMenu) => {
    setEditingMenu(menu);
    setFormData({
      label_en: menu.label_en,
      label_id: menu.label_id,
      href: menu.href || '',
      parent_id: menu.parent_id,
      is_visible: menu.is_visible,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingMenu) {
      await updateMenu.mutateAsync({
        id: editingMenu.id,
        ...formData,
        href: formData.href || null,
      });
    } else {
      const maxSortOrder = flatMenus?.filter(m => m.parent_id === formData.parent_id)
        .reduce((max, m) => Math.max(max, m.sort_order), -1) ?? -1;
      
      await createMenu.mutateAsync({
        ...formData,
        href: formData.href || null,
        sort_order: maxSortOrder + 1,
        icon: null,
      });
    }
    setIsDialogOpen(false);
    setFormData(defaultFormData);
  };

  const handleDelete = async () => {
    if (deleteMenuId) {
      await deleteMenu.mutateAsync(deleteMenuId);
      setDeleteMenuId(null);
    }
  };

  const handleToggleVisibility = async (menu: NavigationMenu) => {
    await updateMenu.mutateAsync({
      id: menu.id,
      is_visible: !menu.is_visible,
    });
  };

  const handleMoveUp = async (menu: NavigationMenu, siblings: NavigationMenu[]) => {
    const index = siblings.findIndex(s => s.id === menu.id);
    if (index <= 0) return;

    const prevItem = siblings[index - 1];
    await reorderMenus.mutateAsync([
      { id: menu.id, sort_order: prevItem.sort_order },
      { id: prevItem.id, sort_order: menu.sort_order },
    ]);
  };

  const handleMoveDown = async (menu: NavigationMenu, siblings: NavigationMenu[]) => {
    const index = siblings.findIndex(s => s.id === menu.id);
    if (index >= siblings.length - 1) return;

    const nextItem = siblings[index + 1];
    await reorderMenus.mutateAsync([
      { id: menu.id, sort_order: nextItem.sort_order },
      { id: nextItem.id, sort_order: menu.sort_order },
    ]);
  };

  const parentOptions = flatMenus?.filter(m => !m.parent_id) || [];

  const MenuItemRow = ({ menu, siblings, level = 0 }: { menu: NavigationMenu; siblings: NavigationMenu[]; level?: number }) => {
    const index = siblings.findIndex(s => s.id === menu.id);
    const isFirst = index === 0;
    const isLast = index === siblings.length - 1;

    return (
      <>
        <div 
          className={cn(
            "flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors",
            !menu.is_visible && "opacity-50"
          )}
          style={{ marginLeft: level * 24 }}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          
          {level > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">
              {language === 'en' ? menu.label_en : menu.label_id}
            </div>
            {menu.href && (
              <div className="text-xs text-muted-foreground truncate">{menu.href}</div>
            )}
            {!menu.href && (
              <div className="text-xs text-muted-foreground italic">
                {language === 'en' ? 'Dropdown parent (no link)' : 'Parent dropdown (tanpa link)'}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleMoveUp(menu, siblings)}
              disabled={isFirst || reorderMenus.isPending}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleMoveDown(menu, siblings)}
              disabled={isLast || reorderMenus.isPending}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleToggleVisibility(menu)}
              disabled={updateMenu.isPending}
            >
              {menu.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleOpenEdit(menu)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => setDeleteMenuId(menu.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {menu.children && menu.children.length > 0 && (
          <div className="space-y-2 mt-2">
            {menu.children.map(child => (
              <MenuItemRow key={child.id} menu={child} siblings={menu.children!} level={level + 1} />
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="ml-6 text-muted-foreground"
              onClick={() => handleOpenCreate(menu.id)}
            >
              <Plus className="h-4 w-4 mr-1" />
              {language === 'en' ? 'Add sub-menu' : 'Tambah sub-menu'}
            </Button>
          </div>
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MenuIcon className="h-6 w-6" />
              {language === 'en' ? 'Navigation Menu' : 'Menu Navigasi'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'en' 
                ? 'Manage website navigation menu items and structure' 
                : 'Kelola item dan struktur menu navigasi website'}
            </p>
          </div>
          <Button onClick={() => handleOpenCreate()}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Add Menu Item' : 'Tambah Menu'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Menu Structure' : 'Struktur Menu'}</CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Drag to reorder, click edit to modify labels and links' 
                : 'Seret untuk mengatur urutan, klik edit untuk mengubah label dan link'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {hierarchicalMenus && hierarchicalMenus.length > 0 ? (
              hierarchicalMenus.map(menu => (
                <MenuItemRow key={menu.id} menu={menu} siblings={hierarchicalMenus} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {language === 'en' ? 'No menu items yet. Add your first menu item.' : 'Belum ada menu. Tambahkan menu pertama Anda.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMenu 
                ? (language === 'en' ? 'Edit Menu Item' : 'Edit Menu')
                : (language === 'en' ? 'Add Menu Item' : 'Tambah Menu')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Label (English)</Label>
                <Input
                  value={formData.label_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, label_en: e.target.value }))}
                  placeholder="Home"
                />
              </div>
              <div>
                <Label>Label (Indonesian)</Label>
                <Input
                  value={formData.label_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, label_id: e.target.value }))}
                  placeholder="Beranda"
                />
              </div>
            </div>

            <div>
              <Label>Link URL</Label>
              <Input
                value={formData.href}
                onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
                placeholder="/page-url (leave empty for dropdown parent)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'en' 
                  ? 'Leave empty if this is a dropdown parent with sub-menus' 
                  : 'Kosongkan jika ini adalah parent dropdown dengan sub-menu'}
              </p>
            </div>

            <div>
              <Label>{language === 'en' ? 'Parent Menu' : 'Menu Induk'}</Label>
              <Select
                value={formData.parent_id || 'none'}
                onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value === 'none' ? null : value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="none">
                    {language === 'en' ? '— No parent (top level)' : '— Tanpa induk (level atas)'}
                  </SelectItem>
                  {parentOptions.map(parent => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {language === 'en' ? parent.label_en : parent.label_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>{language === 'en' ? 'Visible' : 'Tampilkan'}</Label>
              <Switch
                checked={formData.is_visible}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_visible: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Batal'}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.label_en || !formData.label_id || createMenu.isPending || updateMenu.isPending}
            >
              {(createMenu.isPending || updateMenu.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'en' ? 'Save' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteMenuId} onOpenChange={() => setDeleteMenuId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'en' ? 'Delete Menu Item?' : 'Hapus Menu?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'en' 
                ? 'This will also delete all sub-menu items. This action cannot be undone.'
                : 'Ini juga akan menghapus semua sub-menu. Tindakan ini tidak dapat dibatalkan.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'en' ? 'Cancel' : 'Batal'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMenu.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'en' ? 'Delete' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
