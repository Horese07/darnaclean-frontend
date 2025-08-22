import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/useApp';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { MapPin, Phone, Mail, Search, ShoppingCart, User, Globe, Menu, LogOut, Settings, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const [showCompact, setShowCompact] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { t, i18n } = useTranslation();
  const { state, getCartItemsCount } = useApp();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  // Mettre à jour le nombre d'articles du panier avec animation
  useEffect(() => {
    const currentCount = getCartItemsCount();
    console.log('Header: Cart count updated:', currentCount, 'Previous:', cartItemCount);
    if (currentCount !== cartItemCount) {
      // Si on ajoute des articles (count augmente), on anime
      if (currentCount > cartItemCount) {
        // L'animation sera déclenchée par le key change
      }
      setCartItemCount(currentCount);
    }
  }, [getCartItemsCount, cartItemCount, state.cart]);

  useEffect(() => {
    const handleScroll = () => {
      setShowCompact(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer les résultats de recherche quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Fonction de recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Naviguer vers la page des produits avec la recherche
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Filtrer les produits basé sur la recherche
  const filteredProducts = searchQuery.trim() 
    ? (state.products || []).filter(product => {
        const query = searchQuery.toLowerCase();
        
        // Extraire le nom du produit de manière sécurisée
        const productName = product?.name && typeof product.name === 'object'
          ? (product.name?.[i18n.language] || product.name?.fr || '')
          : (product.name || '');
        
        // Extraire la description du produit de manière sécurisée
        const productDescription = product?.description && typeof product.description === 'object'
          ? (product.description[i18n.language] || product.description.fr || '')
          : (product.description || '');
        
        // Extraire le nom de la catégorie de manière sécurisée
        const categoryName = product.category && typeof product.category.name === 'object' && product.category.name !== null
          ? (product.category.name[i18n.language] || product.category.name.fr || '')
          : (product.category?.name || '');
        
        const name = productName.toLowerCase();
        const description = productDescription.toLowerCase();
        const category = categoryName.toLowerCase();
        
        return name.includes(query) || description.includes(query) || category.includes(query);
      }).slice(0, 5) // Limiter à 5 résultats pour l'aperçu
    : [];

  return (
    <header className="bg-white shadow-sm border-b fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Top bar with contact info, search, language, cart, account, etc. (hide on scroll) */}
      {!showCompact && (
        <div className="bg-emerald-600 text-white py-2 transition-all duration-300">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              {/* Contact Info Only */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <a href="https://wa.me/c/212775177029" target="_blank" rel="noopener noreferrer">+212 775-177029</a>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>darnaclean@gmail.com</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Livraison dans tout le Maroc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main header: logo and nav links (always visible, compact on scroll) */}
      <div className={`container mx-auto px-4 py-4 transition-all duration-300 ${showCompact ? 'py-2' : ''}`}>
        <nav className="flex items-center space-x-8">
          <img
            src="/logo/logo.png"
            alt="DarnaClean Logo"
            className="w-14 h-14 object-contain self-center"
            style={{ minWidth: '56px', minHeight: '56px' }}
          />
          <Link
            to="/"
            className="text-gray-700 hover:text-emerald-600 font-medium py-2 border-b-2 border-transparent hover:border-emerald-600 transition-colors flex items-center"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/products"
            className="text-gray-700 hover:text-emerald-600 font-medium py-2 border-b-2 border-transparent hover:border-emerald-600 transition-colors flex items-center"
          >
            {t('nav.products')}
          </Link>
          {/* Categories dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-700 hover:text-emerald-600 font-medium py-2 border-b-2 border-transparent hover:border-emerald-600 transition-colors flex items-center">
              {t('nav.categories')}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {(Array.isArray(state.categories) ? state.categories : []).map((category) => {
                // Vérifier que category.name est un objet et extraire la valeur appropriée
                const categoryName = typeof category.name === 'object' && category.name !== null
                  ? (category.name[i18n.language] || category.name.fr || 'Catégorie')
                  : (category.name || 'Catégorie');
                
                return (
                  <DropdownMenuItem key={category.id}>
                    <Link to={`/products/${category.slug || category.id}`}>
                      {categoryName}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            to="/about"
            className="text-gray-700 hover:text-emerald-600 font-medium py-2 border-b-2 border-transparent hover:border-emerald-600 transition-colors flex items-center"
          >
            {t('nav.about')}
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-emerald-600 font-medium py-2 border-b-2 border-transparent hover:border-emerald-600 transition-colors flex items-center"
          >
            {t('nav.contact')}
          </Link>

          {/* Spacer between nav and right actions */}
          <div className="flex-1" />

          {/* Search bar */}
          <div className="relative flex items-center mr-4 search-container">
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                placeholder={t('common.search', 'Rechercher...')}
                className="h-8 px-2 text-sm rounded-l w-64"
              />
              <Button type="submit" size="icon" className="h-8 w-8 rounded-r bg-emerald-700 hover:bg-emerald-800 text-white">
                <Search className="w-4 h-4" />
              </Button>
            </form>
            
            {/* Résultats de recherche en temps réel */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  <div className="p-2">
                    <div className="text-xs text-gray-500 mb-2 px-2">
                      {filteredProducts.length} résultat(s) trouvé(s)
                    </div>
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-md mr-3 flex items-center justify-center">
                          {product.images && product.images[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={typeof product.name === 'object' && product.name !== null
                                ? (product.name[i18n.language] || product.name.fr || 'Produit')
                                : (product.name || 'Produit')}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">IMG</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {product.name && typeof product.name === 'object'
                              ? (product.name[i18n.language] || product.name.fr || 'Produit')
                              : (product.name || 'Produit')}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {product.category && typeof product.category.name === 'object' && product.category.name !== null
                              ? (product.category.name[i18n.language] || product.category.name.fr || 'Catégorie')
                              : (product.category?.name || 'Catégorie')}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-emerald-600 ml-2">
                          {Number(product.price).toFixed(2)} {product.currency || 'MAD'}
                        </div>
                      </Link>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <Link
                        to={`/products?search=${encodeURIComponent(searchQuery.trim())}`}
                        className="block text-center text-sm text-emerald-600 hover:text-emerald-700 py-2 px-4 rounded-md hover:bg-emerald-50 transition-colors"
                        onClick={() => setShowSearchResults(false)}
                      >
                        Voir tous les résultats ({filteredProducts.length})
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Aucun produit trouvé</p>
                    <p className="text-xs">Essayez avec d'autres mots-clés</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language selector (Français) */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-sm px-2 py-1 border border-gray-200 rounded hover:bg-gray-100">
              <span className="mr-1">🇫🇷</span> Français
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map(lang => (
                <DropdownMenuItem key={lang.code} onClick={() => i18n.changeLanguage(lang.code)}>
                  <span className="mr-2">{lang.flag}</span> {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Panier */}
          <Link to="/cart" className="flex items-center hover:text-emerald-600 text-sm ml-4 relative group">
            <div className="relative">
              <ShoppingCart 
                className={`w-5 h-5 mr-1 transition-all duration-300 ${
                  cartItemCount > 0 ? 'text-emerald-600' : 'text-gray-600'
                } group-hover:scale-110`} 
              />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className={`absolute -top-2 -right-2 h-5 min-w-[20px] px-1 text-xs font-bold shadow-lg transition-all duration-300 ${
                    cartItemCount > 0 ? 'animate-bounce' : ''
                  } hover:scale-110`}
                  key={cartItemCount} // Force re-render pour l'animation
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Badge>
              )}
            </div>
            <span className="ml-1">Panier ({cartItemCount})</span>
          </Link>

          {/* Mon compte (all the way right) */}
          <div className="flex-1 flex justify-end">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.first_name} />
                      <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.first_name} {user.last_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon profil</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Dashboard Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="flex items-center hover:text-emerald-600 text-sm ml-4">
                <User className="w-5 h-5 mr-1" />
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
