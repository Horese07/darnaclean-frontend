import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/useApp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  CreditCard,
  Truck,
  Shield,
  ArrowLeft,
  Package,
  CheckCircle,
} from 'lucide-react';

export function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const { state, getCartTotal, clearCart } = useApp();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
    acceptTerms: false,
  });

  const subtotal = getCartTotal();
  const shipping = subtotal >= 200 ? 0 : 25;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast.error('Veuillez accepter les conditions générales');
      return;
    }

    if (state.cart.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect
      clearCart();
      toast.success('Commande confirmée ! Vous allez recevoir un email de confirmation.');
      navigate('/order-success');
    } catch (error) {
      toast.error('Erreur lors du traitement de la commande');
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Votre panier est vide
        </h1>
        <p className="text-gray-600 mb-8">
          Ajoutez des produits à votre panier pour procéder au checkout
        </p>
        <Link to="/products">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuer mes achats
          </Button>
        </Link>
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
          <Link to="/cart" className="hover:text-emerald-600">{t('cart.title')}</Link>
          <span className="mx-2">›</span>
          <span>{t('checkout.title')}</span>
        </nav>
        
        <h1 className="text-3xl font-bold text-gray-900">
          {t('checkout.title')}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  {t('checkout.shippingInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t('checkout.firstName')} *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t('checkout.lastName')} *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">{t('checkout.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('checkout.phone')} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">{t('checkout.address')} *</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">{t('checkout.city')} *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">{t('checkout.postalCode')}</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {t('checkout.paymentMethod')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-medium">{t('checkout.paymentMethods.cod')}</div>
                      <div className="text-sm text-gray-600">
                        Payez en espèces à la livraison
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                    <RadioGroupItem value="card" id="card" disabled />
                    <Label htmlFor="card" className="flex-1">
                      <div className="font-medium">{t('checkout.paymentMethods.card')}</div>
                      <div className="text-sm text-gray-600">
                        Bientôt disponible
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                    <RadioGroupItem value="paypal" id="paypal" disabled />
                    <Label htmlFor="paypal" className="flex-1">
                      <div className="font-medium">{t('checkout.paymentMethods.paypal')}</div>
                      <div className="text-sm text-gray-600">
                        Bientôt disponible
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Terms and conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    J'accepte les{' '}
                    <Link to="/terms" className="text-emerald-600 hover:underline">
                      conditions générales
                    </Link>{' '}
                    et la{' '}
                    <Link to="/privacy" className="text-emerald-600 hover:underline">
                      politique de confidentialité
                    </Link>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Products */}
                <div className="space-y-3">
                  {state.cart.map((item) => {
                    const productName = item.product.name[i18n.language] || item.product.name.fr;
                    return (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{productName}</div>
                          <div className="text-gray-600">
                            {item.quantity} × {item.product.price.toFixed(2)} {t('common.currency')}
                          </div>
                        </div>
                        <div className="font-medium">
                          {(item.product.price * item.quantity).toFixed(2)} {t('common.currency')}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
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
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={isProcessing || !formData.acceptTerms}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Traitement...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{t('checkout.placeOrder')}</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Security features */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">Paiement sécurisé</div>
                    <div className="text-sm text-gray-600">Vos données sont protégées</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Livraison rapide</div>
                    <div className="text-sm text-gray-600">24-48h dans tout le Maroc</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
