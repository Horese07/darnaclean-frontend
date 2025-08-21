import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/useApp';
// Import Product type from AppContext to ensure type compatibility with addToCart
import type { Product } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Eye,
  Star,
  Heart,
  Package,
  AlertCircle,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

// Ensure hooks are called at the top level
export function ProductCard({ product, className = '' }: ProductCardProps) {
  const { t, i18n } = useTranslation();
const { addToCart } = useApp();
const [isLoading, setIsLoading] = useState(false);
const [isWishlisted, setIsWishlisted] = useState(false);

// Remove duplicate function declaration since it's already declared above
  if (!product) {
    return <div className="text-red-500">Product data is unavailable.</div>;
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if ((product.stock || 0) <= 0) {
      toast.error(t('products.outOfStock'));
      return;
    }

    setIsLoading(true);
    
    try {
      addToCart(product, 1);
      toast.success(`${product.name[i18n.language] || product.name.fr || t('products.unnamedProduct')} ajouté au panier !`);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : 0;

  return (
    <Link to={`/product/${product.slug}`}>
      <Card className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md overflow-hidden ${className}`}>
        <div className="relative">
          {/* Product image */}
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name[i18n.language] || product.name.fr || t('products.unnamedProduct')}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
                    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100%" height="100%" fill="#f3f4f6"/>
                      <circle cx="100" cy="80" r="30" fill="#d1d5db"/>
                      <rect x="70" y="120" width="60" height="40" rx="8" fill="#d1d5db"/>
                      <text x="100" y="180" text-anchor="middle" fill="#6b7280" font-size="12">${product.brand}</text>
                    </svg>
                  `)}`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.onSale && (
                <Badge className="bg-red-500 hover:bg-red-500 text-white shadow-lg">
                  {discountPercentage > 0 ? `-${discountPercentage}%` : t('common.sale')}
                </Badge>
              )}
              {product.badges && product.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="shadow-lg">
                  {badge}
                </Badge>
              ))}
              {product.stock <= 10 && product.stock > 0 && (
                <Badge variant="destructive" className="shadow-lg">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Stock faible
                </Badge>
              )}
            </div>

            {/* Wishlist button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/80 hover:bg-white shadow-lg"
              onClick={handleWishlist}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>

            {/* Quick view button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button variant="secondary" size="sm" className="shadow-lg">
                <Eye className="w-4 h-4 mr-2" />
                {t('products.viewDetails')}
              </Button>
            </div>

            {/* Stock indicator */}
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                <Badge variant="destructive" className="text-white">
                  {t('products.outOfStock')}
                </Badge>
              </div>
            )}
          </div>

          {/* Product info */}
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Brand */}
              <div className="text-sm text-emerald-600 font-medium">
                {product.brand}
              </div>

              {/* Product name */}
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                {product.name[i18n.language] || product.name.fr || t('products.unnamedProduct')}
              </h3>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(Number(product.rating) || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({(product.reviewCount || 0)} {t('products.reviews')})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {Number(product.price).toFixed(2)} {product.currency || t('common.currency')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {Number(product.originalPrice).toFixed(2)} {product.currency || t('common.currency')}
                      </span>
                    )}
                  </div>
                  
                  {/* Stock status */}
                  <div className="text-xs text-gray-500">
                    {(product.stock || 0) > 10 ? (
                      <span className="text-green-600">En stock</span>
                    ) : (product.stock || 0) > 0 ? (
                      <span className="text-orange-600">Stock limité ({(product.stock || 0)})</span>
                    ) : (
                      <span className="text-red-600">{t('products.outOfStock')}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Add to cart button */}
              <Button
                onClick={handleAddToCart}
                disabled={isLoading || (product.stock || 0) <= 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                size="sm"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Ajout...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t('products.addToCart')}</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );

} // End of ProductCard component
