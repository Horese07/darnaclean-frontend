import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Clock, 
  Phone, 
  Mail, 
  ArrowLeft,
  Download,
  Share2,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export function OrderSuccessPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Données simulées de la commande (en réalité, cela viendrait de l'URL ou du state)
  const orderData = {
    id: 'DRN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date().toLocaleDateString('fr-FR'),
    total: 285.50,
    items: 3,
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
    paymentMethod: 'Paiement à la livraison',
    status: 'confirmed'
  };

  // Rediriger vers l'accueil si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      toast.error('Vous devez être connecté pour accéder à cette page');
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleDownloadInvoice = () => {
    toast.info('La facture sera disponible dans quelques minutes');
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ma commande DarnaClean',
        text: `Commande ${orderData.id} confirmée avec succès !`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  if (!user) {
    return null; // Ou un loader pendant la redirection
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec animation de succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Commande confirmée !
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Merci {user.first_name} ! Votre commande a été enregistrée avec succès et sera traitée dans les plus brefs délais.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Détails de la commande */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations principales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-emerald-600" />
                  Détails de votre commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Numéro de commande</label>
                    <p className="text-lg font-bold text-gray-900">{orderData.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date de commande</label>
                    <p className="text-lg font-semibold text-gray-900">{orderData.date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Montant total</label>
                    <p className="text-lg font-bold text-emerald-600">{orderData.total.toFixed(2)} MAD</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre d'articles</label>
                    <p className="text-lg font-semibold text-gray-900">{orderData.items} articles</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {orderData.status === 'confirmed' ? 'Confirmée' : 'En traitement'}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                      <Download className="w-4 h-4 mr-2" />
                      Facture
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShareOrder}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Livraison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-blue-600" />
                  Informations de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Livraison estimée</p>
                      <p className="text-sm text-gray-600">{orderData.estimatedDelivery}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    2-3 jours ouvrés
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Suivi de votre commande</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Vous recevrez un email avec le numéro de suivi dès que votre commande sera expédiée.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                      <span className="text-sm text-blue-700">Confirmée</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-500">En préparation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-500">Expédiée</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-500">Livrée</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-amber-600" />
                  Mode de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{orderData.paymentMethod}</p>
                    <p className="text-sm text-gray-600">
                      Vous paierez {orderData.total.toFixed(2)} MAD en espèces à la livraison
                    </p>
                  </div>
                  <Badge variant="outline" className="border-amber-200 text-amber-700">
                    À la livraison
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec actions */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/products" className="block">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Package className="w-4 h-4 mr-2" />
                    Continuer mes achats
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full">
                    Voir mes commandes
                  </Button>
                </Link>
                <Link to="/" className="block">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à l'accueil
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Support client */}
            <Card>
              <CardHeader>
                <CardTitle>Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Notre équipe est là pour vous aider
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <Phone className="w-4 h-4 mr-2 text-emerald-600" />
                      <span className="text-sm font-medium">+212 5XX XXX XXX</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                      <span className="text-sm font-medium">support@darnaclean.ma</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Heures d'ouverture : Lun-Ven 9h-18h
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Garanties */}
            <Card>
              <CardHeader>
                <CardTitle>Nos garanties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Produits authentiques</p>
                    <p className="text-xs text-gray-600">100% originaux et certifiés</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Livraison sécurisée</p>
                    <p className="text-xs text-gray-600">Emballage soigné et suivi</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Support client</p>
                    <p className="text-xs text-gray-600">Assistance rapide et efficace</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
