import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/useApp';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MapPin, Phone, Mail, Search, ShoppingCart, User, Globe, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const [showCompact, setShowCompact] = useState(false);
  const { t, i18n } = useTranslation();
  const { state } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setShowCompact(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

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
              {(Array.isArray(state.categories) ? state.categories : []).map((category) => (
                <DropdownMenuItem key={category.id}>
                  <Link to={`/products/${category.slug}`}>
                    {category.name[i18n.language] || category.name.fr}
                  </Link>
                </DropdownMenuItem>
              ))}
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
          <form className="flex items-center mr-4" onSubmit={e => { e.preventDefault(); }}>
            <Input
              type="text"
              placeholder={t('common.search', 'Rechercher...')}
              className="h-8 px-2 text-sm rounded-l"
            />
            <Button type="submit" size="icon" className="h-8 w-8 rounded-r bg-emerald-700 hover:bg-emerald-800 text-white">
              <Search className="w-4 h-4" />
            </Button>
          </form>

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
          <Link to="/cart" className="flex items-center hover:text-emerald-600 text-sm ml-4">
            <ShoppingCart className="w-5 h-5 mr-1" />
            Panier
          </Link>

          {/* Mon compte (all the way right) */}
          <div className="flex-1 flex justify-end">
            <Link to="/account" className="flex items-center hover:text-emerald-600 text-sm ml-4">
              <User className="w-5 h-5 mr-1" />
              Mon compte
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
