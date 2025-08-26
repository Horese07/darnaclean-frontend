import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Upload, 
  Search, 
  Filter,
  Package,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '@/contexts/useApp';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: number;
  // Structure actuelle de l'API
  name_fr?: string;
  name_en?: string;
  name_ar?: string;
  // Structure alternative (pour compatibilité)
  name?: { fr: string; en: string; ar: string };
  
  description_fr?: string;
  description_en?: string;
  description_ar?: string;
  description?: { fr: string; en: string; ar: string };
  
  price: number | string;
  currency: string;
  category_id: number;
  category?: {
    id: number;
    name_fr?: string;
    name_en?: string;
    name_ar?: string;
    name?: { fr: string; en: string; ar: string };
    slug: string;
  };
  stock: number;
  images: string[];
  slug: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Champs optionnels
  brand?: string;
  sku?: string;
  featured?: boolean;
  on_sale?: boolean;
  badges?: string[];
  rating?: number;
  review_count?: number;
}

interface Category {
  id: number;
  // Structure actuelle de l'API (retournée par CategoryController)
  name: { fr: string; en: string; ar: string };
  slug: string;
  description?: { fr: string; en: string; ar: string };
  image?: string;
  icon?: string;
  featured?: boolean;
  products_count?: number;
}

export function ProductManagement() {
  const { state } = useApp();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en' | 'ar'>('fr');

  // Form state
  const [formData, setFormData] = useState({
    name: { fr: '', en: '', ar: '' },
    description: { fr: '', en: '', ar: '' },
    price: '',
    currency: 'MAD',
    category_id: '',
    stock: '',
    images: [] as string[],
    is_active: true
  });

  // API base URL
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

  // Charger les produits depuis l'API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      } else {
        console.error('Erreur lors du chargement des produits');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les catégories depuis l'API
  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        console.log('Categories API response:', data);
        
        // Gérer la structure actuelle de l'API (data.data.categories)
        if (data.success && data.data && data.data.categories && Array.isArray(data.data.categories)) {
          setCategories(data.data.categories);
        } else if (data.success && data.data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Categories data structure not recognized:', data);
          setCategories([]);
        }
      } else {
        console.error('Erreur lors du chargement des catégories:', response.status);
        setCategories([]);
      }
    } catch (error) {
      console.error('Erreur réseau lors du chargement des catégories:', error);
      setCategories([]);
    }
  };

  // Initialisation
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    // Gérer la structure actuelle de l'API (name_fr, name_en, name_ar)
    const productName = product.name_fr || product.name_en || product.name_ar || '';
    const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      product.category_id.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: { fr: '', en: '', ar: '' },
      description: { fr: '', en: '', ar: '' },
      price: '',
      currency: 'MAD',
      category_id: '',
      stock: '',
      images: [],
      is_active: true
    });
  };

  // Ouvrir le dialogue d'ajout
  const openAddDialog = () => {
    resetForm();
    setShowAddDialog(true);
  };

  // Ouvrir le dialogue d'édition
  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      // Convertir la structure actuelle (name_fr, name_en, name_ar) vers la structure attendue
      name: {
        fr: product.name_fr || product.name?.fr || '',
        en: product.name_en || product.name?.en || '',
        ar: product.name_ar || product.name?.ar || ''
      },
      description: {
        fr: product.description_fr || product.description?.fr || '',
        en: product.description_en || product.description?.en || '',
        ar: product.description_ar || product.description?.ar || ''
      },
      price: (typeof product.price === 'string' ? parseFloat(product.price) : product.price).toString(),
      currency: product.currency,
      category_id: product.category_id.toString(),
      stock: product.stock.toString(),
      images: product.images,
      is_active: product.is_active !== undefined ? product.is_active : true
    });
    setShowEditDialog(true);
  };

  // Ajouter un produit
  const addProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || localStorage.getItem('darnaclean-token')}`
        },
        body: JSON.stringify({
          ...formData,
          price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
          stock: typeof formData.stock === 'string' ? parseInt(formData.stock) : formData.stock,
          category_id: typeof formData.category_id === 'string' ? parseInt(formData.category_id) : formData.category_id
        })
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct.data]);
        setShowAddDialog(false);
        resetForm();
        alert('Produit ajouté avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout du produit');
    }
  };

  // Mettre à jour un produit
  const updateProduct = async () => {
    if (!editingProduct) return;

    try {
      // Préparer les données à envoyer
      const updateData = {
        ...formData,
        price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
        stock: typeof formData.stock === 'string' ? parseInt(formData.stock) : formData.stock,
        category_id: typeof formData.category_id === 'string' ? parseInt(formData.category_id) : formData.category_id
      };

      console.log('🔍 Données à envoyer pour la mise à jour:', updateData);
      
      // Vérifier tous les tokens possibles
      const authToken = localStorage.getItem('auth_token');
      const darnacleanToken = localStorage.getItem('darnaclean-token');
      const token = authToken || darnacleanToken;
      
      console.log('🔑 Token auth_token:', authToken);
      console.log('🔑 Token darnaclean-token:', darnacleanToken);
      console.log('🔑 Token final utilisé:', token);
      console.log('🔑 Token existe:', !!token);
      console.log('🔑 Longueur du token:', token ? token.length : 0);

      if (!token) {
        alert('❌ Aucun token d\'authentification trouvé. Veuillez vous reconnecter.');
        return;
      }

      const url = `${API_BASE_URL}/products/${editingProduct.id}`;
      console.log('🌐 URL de la requête:', url);

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      console.log('📋 Headers envoyés:', headers);

      const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updateData)
      });

      console.log('📥 Réponse reçue:', response);
      console.log('📊 Status:', response.status);
      console.log('🔗 Headers de réponse:', response.headers);

      if (response.ok) {
        const updatedProduct = await response.json();
        console.log('✅ Produit mis à jour avec succès:', updatedProduct);
        
        setProducts(products.map(p => 
          p.id === editingProduct.id ? updatedProduct.data : p
        ));
        setShowEditDialog(false);
        setEditingProduct(null);
        resetForm();
        alert('Produit mis à jour avec succès !');
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur de réponse:', errorText);
        
        let errorMessage = 'Erreur inconnue';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = `Erreur ${response.status}: ${errorText}`;
        }
        
        alert(`Erreur: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      console.error('❌ Type d\'erreur:', error.constructor.name);
      console.error('❌ Message d\'erreur:', error.message);
      console.error('❌ Stack trace:', error.stack);
      alert(`Erreur lors de la mise à jour du produit: ${error.message}`);
    }
  };

  // Supprimer un produit
  const deleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${deletingProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || localStorage.getItem('darnaclean-token')}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== deletingProduct.id));
        setShowDeleteDialog(false);
        setDeletingProduct(null);
        alert('Produit supprimé avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  // Exporter en CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Nom (FR)', 'Nom (EN)', 'Nom (AR)', 'Prix', 'Stock', 'Catégorie', 'Statut'];
    const csvContent = [
      headers.join(','),
             ...filteredProducts.map(product => [
         product.id,
         `"${product.name_fr || ''}"`,
         `"${product.name_en || ''}"`,
         `"${product.name_ar || ''}"`,
         typeof product.price === 'string' ? parseFloat(product.price) : product.price,
         product.stock,
         `"${product.category?.name_fr || product.category?.name_en || product.category?.name_ar || ''}"`,
         product.is_active ? 'Actif' : 'Inactif'
       ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'produits.csv';
    link.click();
  };

  // Importer depuis CSV
  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      // Logique d'import à implémenter
      console.log('Import CSV:', headers, lines.slice(1));
      alert('Fonctionnalité d\'import en cours de développement');
    };
    reader.readAsText(file);
  };

  // Rendu du composant
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des produits</h2>
          <p className="text-gray-600">Gérez votre catalogue de produits</p>
        </div>
        <Button onClick={openAddDialog} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {Array.isArray(categories) && categories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name?.fr || category.name?.en || category.name?.ar || 'Sans nom'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
              <Button variant="outline" asChild>
                <label>
                  <Upload className="w-4 h-4 mr-2" />
                  Importer CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={importFromCSV}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des produits */}
      <Card>
        <CardHeader>
          <CardTitle>Produits ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.images && product.images[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name_fr || product.name_en || product.name_ar || 'Produit'}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                                         <TableCell>
                       <div>
                         <div className="font-medium">
                           {product.name_fr || product.name_en || product.name_ar || 'Sans nom'}
                         </div>
                         <div className="text-sm text-gray-500">{product.slug}</div>
                       </div>
                     </TableCell>
                                         <TableCell>
                       {product.category?.name_fr || product.category?.name_en || product.category?.name_ar || 'Sans catégorie'}
                     </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {parseFloat(product.price).toFixed(2)} {product.currency}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={product.stock > 10 ? 'text-green-600' : 'text-red-600'}>
                          {product.stock}
                        </span>
                        {product.stock <= 10 && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingProduct(product);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogue d'ajout de produit */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
            onSubmit={addProduct}
            onCancel={() => setShowAddDialog(false)}
            submitLabel="Ajouter"
          />
        </DialogContent>
      </Dialog>

      {/* Dialogue d'édition de produit */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
            onSubmit={updateProduct}
            onCancel={() => setShowEditDialog(false)}
            submitLabel="Mettre à jour"
          />
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
                         <p>Êtes-vous sûr de vouloir supprimer le produit "{deletingProduct?.name_fr || deletingProduct?.name_en || deletingProduct?.name_ar || 'Sans nom'}" ?</p>
            <p className="text-sm text-gray-500 mt-2">Cette action est irréversible.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={deleteProduct}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant du formulaire de produit
interface ProductFormProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: Category[];
  currentLanguage: 'fr' | 'en' | 'ar';
  setCurrentLanguage: (lang: 'fr' | 'en' | 'ar') => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

function ProductForm({
  formData,
  setFormData,
  categories,
  currentLanguage,
  setCurrentLanguage,
  onSubmit,
  onCancel,
  submitLabel
}: ProductFormProps) {
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' }
  ];

  return (
    <div className="space-y-6">
      {/* Sélecteur de langue */}
      <div className="flex space-x-2">
        {languages.map(lang => (
          <Button
            key={lang.code}
            variant={currentLanguage === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentLanguage(lang.code as 'fr' | 'en' | 'ar')}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </Button>
        ))}
      </div>

      {/* Formulaire */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name">Nom du produit ({currentLanguage.toUpperCase()})</Label>
          <Input
            id="name"
            value={formData.name[currentLanguage]}
            onChange={(e) => setFormData({
              ...formData,
              name: { ...formData.name, [currentLanguage]: e.target.value }
            })}
            placeholder="Nom du produit"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description ({currentLanguage.toUpperCase()})</Label>
          <textarea
            id="description"
            value={formData.description[currentLanguage]}
            onChange={(e) => setFormData({
              ...formData,
              description: { ...formData.description, [currentLanguage]: e.target.value }
            })}
            placeholder="Description du produit"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24"
          />
        </div>

        <div>
          <Label htmlFor="price">Prix</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="currency">Devise</Label>
          <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MAD">MAD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(categories) && categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name?.fr || category.name?.en || category.name?.ar || 'Sans nom'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="0"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center space-x-2">
            <input
              id="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="is_active">Produit actif</Label>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onSubmit} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="w-4 h-4 mr-2" />
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
