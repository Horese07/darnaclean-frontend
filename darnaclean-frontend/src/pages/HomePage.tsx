import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/useApp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product/ProductCard';
import {
  ShoppingCart,
  Truck,
  Shield,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Heart,
  Award,
} from 'lucide-react';

export function HomePage() {

  const { t, i18n } = useTranslation();
  const { state, dispatch } = useApp();

  // Local state for loading
  const [loadingHero, setLoadingHero] = useState(false);
  // State for testimonials
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);

  // Correction : s'assurer que state.products est un tableau (backend peut renvoyer un objet)
  type ProductsDataType = { data?: { products?: any[] } };
  const productsArray = Array.isArray(state.products)
    ? state.products
    : (
        state.products &&
        typeof state.products === 'object' &&
        state.products !== null &&
        !Array.isArray(state.products) &&
        'data' in state.products &&
        (state.products as any).data &&
        Array.isArray((state.products as ProductsDataType).data?.products)
      )
      ? (state.products as ProductsDataType).data!.products!
      : [];

  // --- Dynamic Hero Section (flat fields: title_fr, title_en, ... ) ---
  // Expected hero data structure:
  // {
  //   title_fr, title_en, title_ar,
  //   description_fr, description_en, description_ar,
  //   cta_fr, cta_en, cta_ar
  // }
  const hero = state.hero || null;

  useEffect(() => {
    setLoadingHero(true);
    fetch(`http://localhost:8000/api/hero?lang=${i18n.language}`)
      .then(res => res.json())
      .then(data => {
        if (dispatch) dispatch({ type: 'SET_HERO', payload: data });
      })
      .finally(() => setLoadingHero(false));
    // eslint-disable-next-line
  }, [i18n.language]);

  // Fetch testimonials when language changes
  useEffect(() => {
    setLoadingTestimonials(true);
    fetch(`http://localhost:8000/api/reviews?lang=${i18n.language}`)
      .then(res => res.json())
      .then(data => setTestimonials(Array.isArray(data) ? data : []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoadingTestimonials(false));
  }, [i18n.language]);

  // Get featured products
  const featuredProducts = productsArray.filter(product => product.featured).slice(0, 8);

  // Get featured categories
  const featuredCategories = Array.isArray(state.categories)
    ? state.categories.filter(category => category.featured)
    : [];

  // Get products on sale
  const saleProducts = productsArray.filter(product => product.onSale).slice(0, 4);

  const features = [
    {
      icon: Shield,
      title: t('hero.features.quality'),
      description: 'Produits certifiés et de marques reconnues',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: Truck,
      title: t('hero.features.delivery'),
      description: 'Livraison gratuite dès 200 MAD',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Clock,
      title: t('hero.features.support'),
      description: 'Support client réactif et professionnel',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Produits disponibles' },
    { value: '50,000+', label: 'Clients satisfaits' },
    { value: '98%', label: 'Taux de satisfaction' },
    { value: '24h', label: 'Livraison express' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[420px] md:h-[350px] lg:h-[420px] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.jpg"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          {/* Add more <source> tags for webm/ogg if needed */}
        </video>
        {/* Overlay for darkening video for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-black/40 to-blue-900/60 z-10" />
        {/* Content on top of video */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-white">
              <div className="space-y-4">
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  <Sparkles className="w-3 h-3 mr-1" />
                  #1 au Maroc pour l'hygiène
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                  {hero?.title}
                </h1>
                <p className="text-xl leading-relaxed drop-shadow">
                  {hero?.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-3">
                    {hero?.cta}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    {t('home.exploreCategories', 'Explorer les catégories')}
                  </Button>
                </Link>
              </div>

              {/* Stats */}
             
            </div>

           
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.whyDarnaClean')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.bestExperience')}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8" >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center" style={{ backgroundColor: 'rgba(8, 112, 4, 0.8)' }}>
                    <div className="text-2xl font-bold text-emerald-200 drop-shadow">{stat.value}</div>
                    <div className="text-sm text-emerald-100 drop-shadow">{stat.label}</div>
                  </div>
                ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="pt-8">
                    <div className={`w-16 h-16 rounded-full ${feature.color} mx-auto mb-4 flex items-center justify-center`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('home.mainCategories')}
              </h2>
              <p className="text-gray-600">
                {t('home.categoriesDescription')}
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                {t('common.seeAll')}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <Link key={category.id} to={`/products/${category.slug}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md">
                  <div className="aspect-square bg-gradient-to-br from-emerald-100 to-blue-100 relative overflow-hidden">
                    {/* Category image placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 group-hover:from-emerald-400/30 group-hover:to-blue-400/30 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl">
                        {category.id === 1 && '🧽'}
                        {category.id === 2 && '🧴'}
                        {category.id === 3 && '👕'}
                        {category.id === 4 && '🦠'}
                        {category.id === 5 && '🧹'}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                      {category.name[i18n.language] || category.name.fr}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {category.description[i18n.language] || category.description.fr}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Produits Vedettes
              </h2>
              <p className="text-gray-600">
                Nos produits les plus populaires et les mieux notés
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                Voir tout
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-red-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-red-100 text-red-800 mb-4">
                <Heart className="w-3 h-3 mr-1" />
                Offres Spéciales
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Promotions Limitées
              </h2>
              <p className="text-gray-600">
                Profitez de nos offres exceptionnelles
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('home.testimonialsTitle')}
            </h2>
            <p className="text-gray-300">
              {t('home.testimonialsSubtitle')}
            </p>
          </div>

          {loadingTestimonials ? (
            <div className="text-center text-gray-300">{t('common.loading', 'Chargement...')}</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center text-gray-300">{t('home.noTestimonials', 'Aucun avis pour le moment')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={testimonial.id || index} className="bg-gray-800 border-gray-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.city}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Award className="w-16 h-16 mx-auto mb-6 text-emerald-200" />
          <h2 className="text-3xl font-bold mb-4">
            {t('home.ctaTitle', 'Prêt à commencer vos achats ?')}
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            {t('home.ctaSubtitle', "Rejoignez des milliers de clients satisfaits et découvrez notre gamme complète de produits d'hygiène et d'entretien")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                {t('home.ctaShop', 'Commencer mes achats')}
                <ShoppingCart className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                {t('home.ctaContact', 'Nous contacter')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
