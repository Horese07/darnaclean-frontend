import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/useApp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  Plus,
  Minus,
  Package,
  Shield,
  Truck,
  RotateCcw,
} from 'lucide-react';

export function ProductDetailPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { state, addToCart } = useApp();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const product = state.products.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Produit non trouvé
        </h1>
        <p className="text-gray-600 mb-8">
          Le produit que vous recherchez n'existe pas ou n'est plus disponible.
        </p>
        <Link to="/products">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux produits
          </Button>
        </Link>
      </div>
    );
  }

  const productName = product.name && typeof product.name === 'object'
    ? (product.name[i18n.language] || product.name['fr'] || Object.values(product.name)[0])
    : product.name || t('products.unnamedProduct');
  const productDescription = product.description[i18n.language] || product.description;
  

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      toast.error(t('products.outOfStock'));
      return;
    }

    setIsLoading(true);
    
    try {
      addToCart(product, quantity);
      toast.success(`${quantity} × ${productName} ajouté au panier !`);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    } finally {
      setIsLoading(false);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-emerald-600">{t('nav.home')}</Link>
        <span className="mx-2">›</span>
        <Link to="/products" className="hover:text-emerald-600">{t('nav.products')}</Link>
        <span className="mx-2">›</span>
        <span>{productName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
                    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100%" height="100%" fill="#f3f4f6"/>
                      <circle cx="200" cy="160" r="60" fill="#d1d5db"/>
                      <rect x="140" y="240" width="120" height="80" rx="16" fill="#d1d5db"/>
                      <text x="200" y="360" text-anchor="middle" fill="#6b7280" font-size="24">${product.brand}</text>
                    </svg>
                  `)}`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-400" />
              </div>
            )}
            
            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.onSale && (
                <Badge className="bg-red-500 hover:bg-red-500 text-white">
                  {discountPercentage > 0 ? `-${discountPercentage}%` : 'PROMO'}
                </Badge>
              )}
              // Ensure badges are checked before mapping
              {product.badges && product.badges.map((badge, index) => (
                <Badge key={index} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Image thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                    selectedImage === index ? 'border-emerald-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand and name */}
          <div>
            <div className="text-emerald-600 font-semibold mb-2">
              {product.brand}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {productName}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviewCount} {t('products.reviews')})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                {product.price.toFixed(2)} {t('common.currency')}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {product.originalPrice.toFixed(2)} {t('common.currency')}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <div className="text-green-600 font-medium">
                Vous économisez {(product.originalPrice! - product.price).toFixed(2)} {t('common.currency')} ({discountPercentage}%)
              </div>
            )}
          </div>

          {/* Stock status */}
          <div className="space-y-2">
            {product.stock > 10 ? (
              <div className="text-green-600 font-medium">✓ En stock</div>
            ) : product.stock > 0 ? (
              <div className="text-orange-600 font-medium">
                ⚠️ Stock limité - Plus que {product.stock} disponible{product.stock > 1 ? 's' : ''}
              </div>
            ) : (
              <div className="text-red-600 font-medium">✗ Rupture de stock</div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {productDescription}
            </p>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Caractéristiques</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, value]) => {
                  if (typeof value === 'object' && value !== null) {
                    const valueObj = value as { [key: string]: string };
                    const displayValue = valueObj[i18n.language] || valueObj.fr || valueObj.en || String(value);
                    return (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-gray-600 capitalize">
                          {key.replace('_', ' ')}
                        </div>
                        <div className="text-gray-900">{displayValue}</div>
                      </div>
                    );
                  }
                  return (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace('_', ' ')}
                      </div>
                      <div className="text-gray-900">{String(value)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantité:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border-0 focus:ring-0"
                  min="1"
                  max={product.stock}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={isLoading || product.stock <= 0}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Ajout...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Ajouter au panier</span>
                  </div>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-12 h-12 p-0"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-12 h-12 p-0"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span className="text-sm">Livraison gratuite dès 200 MAD</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Garantie qualité et authenticité</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-purple-600" />
                <span className="text-sm">Retour possible sous 14 jours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
