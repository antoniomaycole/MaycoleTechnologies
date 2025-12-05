import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  X,
  Lock,
  Unlock,
  Save,
  Plus,
  Trash2,
  Edit,
  Check,
  FileText,
  Package,
  Link as LinkIcon,
  Image,
  Upload,
  Eye,
  Sparkles,
  AlertCircle,
  Key,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

// LocalStorage keys
const STORAGE_KEYS = {
  heroTitle: 'dev_hero_title',
  heroSubtitle: 'dev_hero_subtitle',
  heroTagline: 'dev_hero_tagline',
  companyName: 'dev_company_name',
  products: 'dev_products',
  socialLinks: 'dev_social_links',
  navLinks: 'dev_nav_links',
  images: 'dev_images',
  authenticated: 'dev_authenticated',
  password: 'dev_panel_password',
};

interface DevPanelProps {
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  imageUrl?: string;
}

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

interface NavLink {
  id: string;
  label: string;
  href: string;
}

interface ImageAsset {
  id: string;
  name: string;
  url: string;
  category: string;
}

type TabType = 'content' | 'products' | 'links' | 'images' | 'settings';

export function DevPanel({ onClose }: DevPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('content');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Content State
  const [heroTitle, setHeroTitle] = useState('MaycoleTechnologies™');
  const [heroSubtitle, setHeroSubtitle] = useState('Changing The Future One Product At A Time');
  const [heroTagline, setHeroTagline] = useState('Premium enterprise solutions powered by AI');
  const [companyName, setCompanyName] = useState('MaycoleTechnologies');

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Links State
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);

  // Images State
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageName, setNewImageName] = useState('');
  const [newImageCategory, setNewImageCategory] = useState('general');

  // Check authentication on mount
  useEffect(() => {
    // Initialize default password if none exists
    const storedPassword = localStorage.getItem(STORAGE_KEYS.password);
    if (!storedPassword) {
      localStorage.setItem(STORAGE_KEYS.password, 'maycole2024');
    }

    const authStatus = sessionStorage.getItem(STORAGE_KEYS.authenticated);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  // Load all data from localStorage
  const loadAllData = () => {
    // Load content
    setHeroTitle(localStorage.getItem(STORAGE_KEYS.heroTitle) || 'MaycoleTechnologies™');
    setHeroSubtitle(
      localStorage.getItem(STORAGE_KEYS.heroSubtitle) || 'Changing The Future One Product At A Time'
    );
    setHeroTagline(
      localStorage.getItem(STORAGE_KEYS.heroTagline) || 'Premium enterprise solutions powered by AI'
    );
    setCompanyName(localStorage.getItem(STORAGE_KEYS.companyName) || 'MaycoleTechnologies');

    // Load products
    const savedProducts = localStorage.getItem(STORAGE_KEYS.products);
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Default products
      setProducts([
        {
          id: '1',
          name: 'MaycoleCheckBook™',
          description: 'AI-powered digital checkbook register with automated expense tracking',
          price: '$29/month',
          features: [
            'AI Agent "Manny"',
            'Offline PWA Support',
            'Real-time Sync',
            'Smart Categories',
          ],
        },
      ]);
    }

    // Load social links
    const savedSocialLinks = localStorage.getItem(STORAGE_KEYS.socialLinks);
    if (savedSocialLinks) {
      setSocialLinks(JSON.parse(savedSocialLinks));
    } else {
      setSocialLinks([
        {
          id: '1',
          name: 'Twitter',
          url: 'https://twitter.com/maycoletechnologies',
          icon: 'Twitter',
        },
        {
          id: '2',
          name: 'LinkedIn',
          url: 'https://linkedin.com/company/maycoletechnologies',
          icon: 'LinkedIn',
        },
        { id: '3', name: 'GitHub', url: 'https://github.com/maycoletechnologies', icon: 'Github' },
      ]);
    }

    // Load nav links
    const savedNavLinks = localStorage.getItem(STORAGE_KEYS.navLinks);
    if (savedNavLinks) {
      setNavLinks(JSON.parse(savedNavLinks));
    } else {
      setNavLinks([
        { id: '1', label: 'Home', href: '#home' },
        { id: '2', label: 'About', href: '#about' },
        { id: '3', label: 'Services', href: '#services' },
        { id: '4', label: 'Products', href: '#products' },
        { id: '5', label: 'Technology', href: '#technologies' },
        { id: '6', label: 'Contact', href: '#contact' },
      ]);
    }

    // Load images
    const savedImages = localStorage.getItem(STORAGE_KEYS.images);
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  };

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem(STORAGE_KEYS.password);

    if (!storedPassword) {
      toast.error('No password set. Please contact administrator.');
      return;
    }

    if (password === storedPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.authenticated, 'true');
      loadAllData();
      toast.success('Dev Panel unlocked! 🔓');
      setPassword('');
    } else {
      toast.error('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.authenticated);
    toast.info('Logged out from Dev Panel');
    onClose();
  };

  // Save Content
  const saveContent = () => {
    localStorage.setItem(STORAGE_KEYS.heroTitle, heroTitle);
    localStorage.setItem(STORAGE_KEYS.heroSubtitle, heroSubtitle);
    localStorage.setItem(STORAGE_KEYS.heroTagline, heroTagline);
    localStorage.setItem(STORAGE_KEYS.companyName, companyName);
    toast.success('Content saved! Refresh to see changes.');
  };

  // Products Management
  const saveProducts = () => {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    toast.success('Products saved! Refresh to see changes.');
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: 'New Product',
      description: 'Product description',
      price: '$0/month',
      features: ['Feature 1', 'Feature 2'],
    };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success('Product deleted');
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    setEditingProduct(null);
    toast.success('Product updated');
  };

  // Links Management
  const saveLinks = () => {
    localStorage.setItem(STORAGE_KEYS.socialLinks, JSON.stringify(socialLinks));
    localStorage.setItem(STORAGE_KEYS.navLinks, JSON.stringify(navLinks));
    toast.success('Links saved! Refresh to see changes.');
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      name: 'New Link',
      url: 'https://',
      icon: 'Link',
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const deleteSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((l) => l.id !== id));
  };

  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    setSocialLinks(socialLinks.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const addNavLink = () => {
    const newLink: NavLink = {
      id: Date.now().toString(),
      label: 'New Link',
      href: '#section',
    };
    setNavLinks([...navLinks, newLink]);
  };

  const deleteNavLink = (id: string) => {
    setNavLinks(navLinks.filter((l) => l.id !== id));
  };

  const updateNavLink = (id: string, field: keyof NavLink, value: string) => {
    setNavLinks(navLinks.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  // Images Management
  const saveImages = () => {
    localStorage.setItem(STORAGE_KEYS.images, JSON.stringify(images));
    toast.success('Images saved!');
  };

  const addImage = () => {
    if (!newImageUrl || !newImageName) {
      toast.error('Please provide image name and URL');
      return;
    }

    const newImage: ImageAsset = {
      id: Date.now().toString(),
      name: newImageName,
      url: newImageUrl,
      category: newImageCategory,
    };

    setImages([...images, newImage]);
    setNewImageUrl('');
    setNewImageName('');
    setNewImageCategory('general');
    toast.success('Image added');
  };

  const deleteImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
    toast.success('Image deleted');
  };

  // Password Change
  const handlePasswordChange = () => {
    const storedPassword = localStorage.getItem(STORAGE_KEYS.password);

    if (!storedPassword) {
      toast.error('No password is currently set. Please contact administrator.');
      return;
    }

    // Validate current password
    if (currentPassword !== storedPassword) {
      toast.error('Current password is incorrect');
      return;
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    // Save new password
    localStorage.setItem(STORAGE_KEYS.password, newPassword);

    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    toast.success('Password changed successfully! 🔐');
  };

  // Export/Import Data
  const exportData = () => {
    const data = {
      heroTitle: localStorage.getItem(STORAGE_KEYS.heroTitle),
      heroSubtitle: localStorage.getItem(STORAGE_KEYS.heroSubtitle),
      heroTagline: localStorage.getItem(STORAGE_KEYS.heroTagline),
      companyName: localStorage.getItem(STORAGE_KEYS.companyName),
      products: localStorage.getItem(STORAGE_KEYS.products),
      socialLinks: localStorage.getItem(STORAGE_KEYS.socialLinks),
      navLinks: localStorage.getItem(STORAGE_KEYS.navLinks),
      images: localStorage.getItem(STORAGE_KEYS.images),
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maycoletechnologies-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        // Import all data
        if (data.heroTitle) localStorage.setItem(STORAGE_KEYS.heroTitle, data.heroTitle);
        if (data.heroSubtitle) localStorage.setItem(STORAGE_KEYS.heroSubtitle, data.heroSubtitle);
        if (data.heroTagline) localStorage.setItem(STORAGE_KEYS.heroTagline, data.heroTagline);
        if (data.companyName) localStorage.setItem(STORAGE_KEYS.companyName, data.companyName);
        if (data.products) localStorage.setItem(STORAGE_KEYS.products, data.products);
        if (data.socialLinks) localStorage.setItem(STORAGE_KEYS.socialLinks, data.socialLinks);
        if (data.navLinks) localStorage.setItem(STORAGE_KEYS.navLinks, data.navLinks);
        if (data.images) localStorage.setItem(STORAGE_KEYS.images, data.images);

        loadAllData();
        toast.success('Data imported successfully! Refresh to see changes.');
      } catch (error) {
        toast.error('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl"
        >
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 mx-auto mb-4 text-maycole-green" />
            <h2 className="text-2xl font-bold maycole-gradient-text mb-2">Dev Panel Access</h2>
            <p className="text-gray-600">Enter password to unlock developer tools</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="dev-password">Password</Label>
              <Input
                id="dev-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter dev password"
                className="mt-1"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 maycole-btn-primary">
                <Unlock className="w-4 h-4 mr-2" />
                Unlock Panel
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Password must be set by administrator in localStorage.
                <br />
                Contact your administrator if you need access.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Main Dev Panel
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold maycole-gradient-text flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Developer Panel
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage content, products, links, and media
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Eye className="w-3 h-3 mr-1" />
                Authenticated
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <Lock className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={activeTab === 'content' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('content')}
              className={activeTab === 'content' ? 'maycole-btn-primary' : ''}
            >
              <FileText className="w-4 h-4 mr-2" />
              Content
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('products')}
              className={activeTab === 'products' ? 'maycole-btn-primary' : ''}
            >
              <Package className="w-4 h-4 mr-2" />
              Products
            </Button>
            <Button
              variant={activeTab === 'links' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('links')}
              className={activeTab === 'links' ? 'maycole-btn-primary' : ''}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Links
            </Button>
            <Button
              variant={activeTab === 'images' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('images')}
              className={activeTab === 'images' ? 'maycole-btn-primary' : ''}
            >
              <Image className="w-4 h-4 mr-2" />
              Images
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('settings')}
              className={activeTab === 'settings' ? 'maycole-btn-primary' : ''}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section Content</CardTitle>
                  <CardDescription>Edit main homepage hero section text</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hero-title">Hero Title</Label>
                    <Input
                      id="hero-title"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hero-subtitle">Hero Subtitle/Tagline</Label>
                    <Input
                      id="hero-subtitle"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hero-tagline">Hero Description</Label>
                    <Textarea
                      id="hero-tagline"
                      value={heroTagline}
                      onChange={(e) => setHeroTagline(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <Button onClick={saveContent} className="maycole-btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Content
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Products Management</CardTitle>
                      <CardDescription>Add, edit, or remove products</CardDescription>
                    </div>
                    <Button onClick={addProduct} size="sm" className="maycole-btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {products.map((product) => (
                    <Card key={product.id} className="border-2">
                      <CardContent className="pt-6">
                        {editingProduct?.id === product.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editingProduct.name}
                              onChange={(e) =>
                                setEditingProduct({ ...editingProduct, name: e.target.value })
                              }
                              placeholder="Product Name"
                            />
                            <Textarea
                              value={editingProduct.description}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Description"
                              rows={2}
                            />
                            <Input
                              value={editingProduct.price}
                              onChange={(e) =>
                                setEditingProduct({ ...editingProduct, price: e.target.value })
                              }
                              placeholder="Price"
                            />
                            <Input
                              value={editingProduct.imageUrl || ''}
                              onChange={(e) =>
                                setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                              }
                              placeholder="Image URL (optional)"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => updateProduct(editingProduct)}
                                size="sm"
                                className="maycole-btn-primary"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                              <Button
                                onClick={() => setEditingProduct(null)}
                                size="sm"
                                variant="outline"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg">{product.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                                <p className="text-maycole-green font-semibold mt-2">
                                  {product.price}
                                </p>
                                {product.imageUrl && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Image: {product.imageUrl}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => setEditingProduct(product)}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => deleteProduct(product.id)}
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  <Button onClick={saveProducts} className="maycole-btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save All Products
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Links Tab */}
          {activeTab === 'links' && (
            <div className="space-y-6">
              {/* Navigation Links */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Navigation Links</CardTitle>
                      <CardDescription>Manage header navigation menu</CardDescription>
                    </div>
                    <Button onClick={addNavLink} size="sm" className="maycole-btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Nav Link
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {navLinks.map((link) => (
                    <div key={link.id} className="flex gap-2 items-center p-3 border rounded-lg">
                      <Input
                        value={link.label}
                        onChange={(e) => updateNavLink(link.id, 'label', e.target.value)}
                        placeholder="Label"
                        className="flex-1"
                      />
                      <Input
                        value={link.href}
                        onChange={(e) => updateNavLink(link.id, 'href', e.target.value)}
                        placeholder="URL/Anchor"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => deleteNavLink(link.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Social Links</CardTitle>
                      <CardDescription>Manage footer social media links</CardDescription>
                    </div>
                    <Button onClick={addSocialLink} size="sm" className="maycole-btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Social Link
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {socialLinks.map((link) => (
                    <div key={link.id} className="flex gap-2 items-center p-3 border rounded-lg">
                      <Input
                        value={link.name}
                        onChange={(e) => updateSocialLink(link.id, 'name', e.target.value)}
                        placeholder="Name"
                        className="flex-1"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                        placeholder="URL"
                        className="flex-1"
                      />
                      <Input
                        value={link.icon}
                        onChange={(e) => updateSocialLink(link.id, 'icon', e.target.value)}
                        placeholder="Icon"
                        className="w-32"
                      />
                      <Button
                        onClick={() => deleteSocialLink(link.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Button onClick={saveLinks} className="maycole-btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save All Links
              </Button>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Image</CardTitle>
                  <CardDescription>
                    Add images by providing a URL (use Unsplash or image hosting service)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="image-name">Image Name</Label>
                      <Input
                        id="image-name"
                        value={newImageName}
                        onChange={(e) => setNewImageName(e.target.value)}
                        placeholder="e.g., Hero Background"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image-category">Category</Label>
                      <Input
                        id="image-category"
                        value={newImageCategory}
                        onChange={(e) => setNewImageCategory(e.target.value)}
                        placeholder="e.g., hero, product, icon"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image-url">Image URL</Label>
                    <Input
                      id="image-url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={addImage} className="maycole-btn-primary">
                    <Upload className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Image Library ({images.length})</CardTitle>
                  <CardDescription>Manage uploaded images</CardDescription>
                </CardHeader>
                <CardContent>
                  {images.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No images uploaded yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((img) => (
                        <Card key={img.id} className="overflow-hidden">
                          <div className="aspect-video bg-gray-100 relative">
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://via.placeholder.com/400x300?text=Image+Error';
                              }}
                            />
                          </div>
                          <CardContent className="p-3">
                            <p className="font-semibold text-sm truncate">{img.name}</p>
                            <p className="text-xs text-gray-500 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {img.category}
                              </Badge>
                            </p>
                            <p className="text-xs text-gray-400 truncate mb-2">{img.url}</p>
                            <Button
                              onClick={() => deleteImage(img.id)}
                              size="sm"
                              variant="outline"
                              className="w-full text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {images.length > 0 && (
                    <Button onClick={saveImages} className="maycole-btn-primary mt-4">
                      <Save className="w-4 h-4 mr-2" />
                      Save Image Library
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update the password for Dev Panel access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={handlePasswordChange} className="maycole-btn-primary">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-maycole-green" />
              <span>Changes stored in localStorage • Refresh page to see updates</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Upload className="w-4 h-4 mr-2" />
                Export Backup
              </Button>
              <label htmlFor="import-data">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('import-data')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2 rotate-180" />
                  Import Backup
                </Button>
              </label>
              <input
                id="import-data"
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
              <Button variant="outline" size="sm" onClick={onClose}>
                Close Panel
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
