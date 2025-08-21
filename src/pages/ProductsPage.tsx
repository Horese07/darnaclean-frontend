import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/useApp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ProductCard } from '@/components/product/ProductCard';
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  Grid3X3,
  List,
  Package,
} from 'lucide-react';
import type { Product } from '@/contexts/AppContext';

export function ProductsPage() {
  const { t, i18n } = useTranslation();
  const { category: categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, dispatch, getFilteredProducts } = useApp();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [showOnSale, setShowOnSale] = useState(false);
  const [showInStock, setShowInStock] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Collapsible states
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isBrandsOpen, setIsBrandsOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  // Get unique brands
  // Correction : s'assurer que state.products est un tableau
  type ProductsState =
    | Product[]
    | { data: { products: Product[] } }
    | undefined;

  const productsState = state.products as ProductsState;

  const productsArray = Array.isArray(productsState)
    ? productsState
    : (productsState && 'data' in productsState && Array.isArray(productsState.data.products))
      ? productsState.data.products
      : [];

  const brands = [...new Set(productsArray.map(p => p.brand))].sort();

  // Get current category
  const currentCategory = categorySlug 
    ? state.categories.find(cat => cat.slug === categorySlug)
    : null;

  // Get subcategories for current category
  const subcategories = currentCategory ? currentCategory.subcategories : [];

  // Load products for current category
  useEffect(() => {
    const loadCategoryProducts = async () => {
      if (!categorySlug) {
        setFilteredProducts(productsArray);
        return;
      }

      setIsLoadingProducts(true);
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${apiBase}/products?category=${categorySlug}`);
        if (response.ok) {
          const data = await response.json();
          const products = data.data?.products || data.products || [];
          setFilteredProducts(products);
        } else {
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Error loading category products:', error);
        setFilteredProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadCategoryProducts();
  }, [categorySlug, productsArray]);

  // Gérer les paramètres de recherche depuis l'URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl && searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams, searchQuery]);

  // Mettre à jour l'URL quand la recherche change
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  // Apply filters
  useEffect(() => {
    const filters: any = {};

    if (categorySlug) {
      filters.category = categorySlug;
    }

    if (selectedSubcategories.length > 0) {
      filters.subcategory = selectedSubcategories[0]; // For simplicity, we'll use the first selected
    }

    if (selectedBrands.length > 0) {
      filters.brand = selectedBrands[0]; // For simplicity, we'll use the first selected
    }

    if (showOnSale) {
      filters.onSale = true;
    }

    if (showInStock) {
      filters.inStock = true;
    }

    filters.priceRange = priceRange;

    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, [categorySlug, selectedSubcategories, selectedBrands, showOnSale, showInStock, priceRange, dispatch]);

  // Search functionality
  const searchedProducts = filteredProducts.filter(product => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const name = (product.name[i18n.language] || product.name.fr || '').toLowerCase();
    const description = (product.description[i18n.language] || product.description.fr || '').toLowerCase();
    const brand = (product.brand || '').toLowerCase();
    const category = (product.category?.name[i18n.language] || product.category?.name.fr || '').toLowerCase();
    const subcategory = (product.subcategory?.name[i18n.language] || product.subcategory?.name.fr || '').toLowerCase();
    const tags = (product.tags || []).join(' ').toLowerCase();
    
    return name.includes(query) || 
           description.includes(query) || 
           brand.includes(query) || 
           category.includes(query) || 
           subcategory.includes(query) || 
           tags.includes(query);
  });

  // Correction : s'assurer que searchedProducts est toujours un tableau
  const safeSearchedProducts = Array.isArray(searchedProducts) ? searchedProducts : [];

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedSubcategories([]);
    setShowOnSale(false);
    setShowInStock(true);
    setPriceRange([0, 1000]);
    setSearchQuery('');
    setSearchParams({});
  };

  const activeFiltersCount = 
    selectedBrands.length + 
    selectedSubcategories.length + 
    (showOnSale ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Search within results */}
      <div className="space-y-2">
        <Label htmlFor="search">{t('common.search')}</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="search"
            placeholder={t('common.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label className="text-base font-medium">{t('products.priceRange')}</Label>
          {isPriceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price" className="text-sm">Min</Label>
              <Input
                id="min-price"
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="max-price" className="text-sm">Max</Label>
              <Input
                id="max-price"
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="text-sm"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Categories */}
      {subcategories.length > 0 && (
        <>
          <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <Label className="text-base font-medium">Sous-catégories</Label>
              {isCategoriesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              {subcategories.map((subcat) => (
                <div key={subcat.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subcat-${subcat.id}`}
                    checked={selectedSubcategories.includes(subcat.slug)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSubcategories([...selectedSubcategories, subcat.slug]);
                      } else {
                        setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcat.slug));
                      }
                    }}
                  />
                  <Label htmlFor={`subcat-${subcat.id}`} className="text-sm font-normal">
                    {subcat.name[i18n.language] || subcat.name.fr}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <Separator />
        </>
      )}

      {/* Brands */}
      <Collapsible open={isBrandsOpen} onOpenChange={setIsBrandsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label className="text-base font-medium">{t('products.brand')}</Label>
          {isBrandsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {brands.slice(0, 10).map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedBrands([...selectedBrands, brand]);
                  } else {
                    setSelectedBrands(selectedBrands.filter(b => b !== brand));
                  }
                }}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm font-normal">
                {brand}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Special filters */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Filtres spéciaux</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-sale"
              checked={showOnSale}
              onCheckedChange={(checked) => setShowOnSale(checked === true)}
            />
            <Label htmlFor="on-sale" className="text-sm font-normal">
              {t('products.onSale')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={showInStock}
              onCheckedChange={(checked) => setShowInStock(checked === true)}
            />
            <Label htmlFor="in-stock" className="text-sm font-normal">
              {t('products.inStock')}
            </Label>
          </div>
        </div>
      </div>

      {/* Clear filters */}
      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
            size="sm"
          >
            <X className="w-4 h-4 mr-2" />
            Effacer tous les filtres ({activeFiltersCount})
          </Button>
        </>
      )}
    </div>
  );

    function handleSortChange(value: string): void {
      dispatch({ type: 'SET_SORT_BY', payload: value as 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest' });
    }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb and page header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-600 mb-4">
          <span>{t('nav.home')}</span>
          <span className="mx-2">›</span>
          <span>{t('nav.products')}</span>
          {currentCategory && (
            <>
              <span className="mx-2">›</span>
              <span>{currentCategory.name[i18n.language] || currentCategory.name.fr}</span>
            </>
          )}
        </nav>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentCategory 
                ? currentCategory.name[i18n.language] || currentCategory.name.fr
                : t('products.title')
              }
            </h1>
            {currentCategory && (
              <p className="text-gray-600 mt-2">
                {currentCategory.description[i18n.language] || currentCategory.description.fr}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View mode toggle */}
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="w-8 h-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="w-8 h-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Sort */}
            <Select value={state.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('products.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récents</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="name">Nom A-Z</SelectItem>
                <SelectItem value="rating">Mieux notés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filtres</h2>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </div>
              <FiltersContent />
            </div>
          </div>
        </div>

        {/* Filters - Mobile */}
        <div className="lg:hidden">
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              <div className="py-6">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Products */}
        <div className="flex-1">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {isLoadingProducts ? (
                'Chargement des produits...'
              ) : (
                `${searchedProducts.length} produit${searchedProducts.length !== 1 ? 's' : ''} trouvé${searchedProducts.length !== 1 ? 's' : ''}`
              )}
            </p>
          </div>

          {/* Loading state */}
          {isLoadingProducts && (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des produits de la catégorie...</p>
            </div>
          )}

          {/* Products grid */}
          {!isLoadingProducts && safeSearchedProducts.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {safeSearchedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  className={viewMode === 'list' ? 'md:flex md:max-w-none' : ''}
                />
              ))}
            </div>
          ) : !isLoadingProducts && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {categorySlug ? 'Aucun produit dans cette catégorie' : 'Aucun produit trouvé'}
              </h3>
              <p className="text-gray-600 mb-6">
                {categorySlug 
                  ? 'Cette catégorie ne contient pas encore de produits'
                  : 'Essayez de modifier vos filtres ou votre recherche'
                }
              </p>
              {!categorySlug && (
                <Button onClick={clearFilters} variant="outline">
                  Effacer tous les filtres
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
