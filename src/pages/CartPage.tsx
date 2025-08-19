import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/useApp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Truck,
  Shield,
  CreditCard,
  Package,
} from 'lucide-react';

export function CartPage() {
  const { t, i18n } = useTranslation();
  const { state, updateCartQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useApp();

  const subtotal = getCartTotal();
  const shipping = subtotal >= 200 ? 0 : 25; // Free shipping over 200 MAD
  const tax = subtotal * 0.2; // 20% VAT
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      toast.success('Produit retiré du panier');
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
    toast.success('Produit retiré du panier');
  };

  if (state.cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('cart.empty')}
          </h1>
          <p className="text-gray-600 mb-8">
            Découvrez notre gamme complète de produits d'hygiène et d'entretien
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('cart.continueShopping')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-emerald-600">{t('nav.home')}</Link>
          <span className="mx-2">›</span>
          <span>{t('cart.title')}</span>
        </nav>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('cart.title')}
          </h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {getCartItemsCount()} article{getCartItemsCount() !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {state.cart.map((item) => {
            const product = item.product;
const productName = product.name
  ? typeof product.name === 'string'
    ? product.name
    : (product.name as { [lang: string]: string })[i18n.language] || (product.name as { [lang: string]: string }).fr || (product.name as { [lang: string]: string }).en || 'Unnamed Product'
  : 'Unnamed Product';       
            return (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product image */}
                    <div className="w-full md:w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
                              <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100%" height="100%" fill="#f3f4f6"/>
                                <circle cx="64" cy="50" r="20" fill="#d1d5db"/>
                                <rect x="44" y="75" width="40" height="25" rx="5" fill="#d1d5db"/>
                                <text x="64" y="115" text-anchor="middle" fill="#6b7280" font-size="8">${product.brand}</text>
                              </svg>
                            `)}`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="text-sm text-emerald-600 font-medium">
                          {product.brand}
                        </div>
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                            {productName}
                          </h3>
                        </Link>
                        <div className="text-sm text-gray-600">
                          SKU: {product.sku}
                        </div>
                      </div>

                      {/* Price and badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {product.price.toFixed(2)} {t('common.currency')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice.toFixed(2)} {t('common.currency')}
                          </span>
                        )}
                        {product.onSale && (
                          <Badge className="bg-red-100 text-red-800">PROMO</Badge>
                        )}
                      </div>

                      {/* Quantity and actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium">{t('cart.quantity')}:</span>
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(product.id, item.quantity - 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center border-0 focus:ring-0"
                              min="1"
                              max={product.stock}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(product.id, item.quantity + 1)}
                              disabled={item.quantity >= product.stock}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {t('cart.remove')}
                        </Button>
                      </div>

                      {/* Stock warning */}
                      {product.stock <= 5 && (
                        <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded">
                          ⚠️ Plus que {product.stock} en stock
                        </div>
                      )}

                      {/* Subtotal */}
                      <div className="text-right">
                        <span className="text-lg font-semibold">
                          {(product.price * item.quantity).toFixed(2)} {t('common.currency')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Continue shopping */}
          <div className="pt-4">
            <Link to="/products">
              <Button variant="outline" className="w-full md:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('cart.continueShopping')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-6">
          {/* Summary card */}
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif de commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} {t('common.currency')}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">{t('common.free')}</span>
                  ) : (
                    `${shipping.toFixed(2)} ${t('common.currency')}`
                  )}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>TVA (20%)</span>
                <span>{tax.toFixed(2)} {t('common.currency')}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{total.toFixed(2)} {t('common.currency')}</span>
              </div>

              {/* Free shipping notice */}
              {shipping > 0 && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  💡 Ajoutez {(200 - subtotal).toFixed(2)} {t('common.currency')} pour bénéficier de la livraison gratuite !
                </div>
              )}

              <Link to="/checkout" className="block">
                <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t('cart.checkout')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium">Livraison rapide</div>
                  <div className="text-sm text-gray-600">24-48h dans tout le Maroc</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Paiement sécurisé</div>
                  <div className="text-sm text-gray-600">SSL et données protégées</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">Garantie qualité</div>
                  <div className="text-sm text-gray-600">Produits authentiques certifiés</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promo code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Code promo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input placeholder="Entrez votre code" />
                <Button variant="outline">Appliquer</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
