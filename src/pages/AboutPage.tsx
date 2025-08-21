import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Truck,
  Clock,
  Users,
  Award,
  Globe,
  Heart,
  Target,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';

export function AboutPage() {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, value: '50,000+', label: t('about.stats.satisfiedCustomers') },
    { icon: Globe, value: 'Tout le Maroc', label: t('about.stats.deliveryZone') },
    { icon: Award, value: '98%', label: t('about.stats.satisfactionRate') },
    { icon: Clock, value: '24h', label: t('about.stats.expressDelivery') },
  ];

  const values = [
    {
      icon: Shield,
      title: t('about.values.premiumQuality.title'),
      description: t('about.values.premiumQuality.description'),
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: Heart,
      title: t('about.values.customerService.title'),
      description: t('about.values.customerService.description'),
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Target,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: CheckCircle,
      title: t('about.values.reliability.title'),
      description: t('about.values.reliability.description'),
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const team = [
    {
      name: 'Ahmed Benali',
      role: 'PDG & Fondateur',
      image: '/images/team/ceo.jpg',
      description: 'Expert en gestion d\'entreprise avec plus de 15 ans d\'expérience',
    },
    {
      name: 'Fatima Zahra',
      role: 'Directrice Marketing',
      image: '/images/team/marketing.jpg',
      description: 'Spécialiste en marketing digital et stratégie commerciale',
    },
    {
      name: 'Karim Tazi',
      role: 'Directeur Technique',
      image: '/images/team/tech.jpg',
      description: 'Ingénieur en logistique et optimisation des processus',
    },
    {
      name: 'Amina Benslimane',
      role: 'Responsable Qualité',
      image: '/images/team/quality.jpg',
      description: 'Experte en contrôle qualité et certification des produits',
    },
  ];

  const milestones = [
    {
      year: '2014',
      title: 'Fondation de DarnaClean',
      description: 'Création de l\'entreprise avec une vision claire : démocratiser l\'accès aux produits d\'hygiène de qualité.',
    },
    {
      year: '2016',
      title: 'Première boutique physique',
      description: 'Ouverture de notre première boutique à Casablanca, marquant le début de notre expansion.',
    },
    {
      year: '2018',
      title: 'Lancement de la plateforme e-commerce',
      description: 'Développement de notre site web pour toucher plus de clients à travers le Maroc.',
    },
    {
      year: '2020',
      title: 'Expansion nationale',
      description: 'Ouverture de 5 nouvelles boutiques dans les principales villes du Maroc.',
    },
    {
      year: '2022',
      title: 'Certification ISO 9001',
      description: 'Obtention de la certification qualité internationale, reconnaissant notre excellence.',
    },
    {
      year: '2024',
      title: 'Leader du marché',
      description: 'DarnaClean devient le leader incontesté du secteur de l\'hygiène au Maroc.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mb-6">
            <Star className="w-3 h-3 mr-1" />
            {t('about.hero.badge')}
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t('about.hero.title')}
          </h1>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto mb-8">
            {t('about.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 text-lg px-8 py-3">
                {t('about.hero.discoverProducts')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-emerald-700 text-lg px-8 py-3">
                {t('about.hero.contactUs')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.mission.title')}</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('about.mission.description1')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.mission.description2')}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.vision.title')}</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t('about.vision.description1')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.vision.description2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.values.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${value.color}`}>
                    <value.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.team.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-emerald-600 font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{member.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.history.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.history.subtitle')}
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-emerald-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-emerald-600 rounded-full border-4 border-white shadow-lg"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                      <div className="text-2xl font-bold text-emerald-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('about.cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 text-lg px-8 py-3">
                {t('about.cta.viewProducts')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-emerald-700 text-lg px-8 py-3">
                {t('about.cta.contactUs')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                         <div>
               <h3 className="text-lg font-semibold mb-4">DarnaClean</h3>
               <p className="text-gray-400 mb-4">
                 {t('about.footer.description')}
               </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Casablanca, Maroc</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+212 775-177029</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>darnaclean@gmail.com</span>
                </div>
              </div>
            </div>
            
                         <div>
               <h3 className="text-lg font-semibold mb-4">{t('about.footer.services')}</h3>
               <ul className="space-y-2 text-gray-400">
                 <li>{t('about.footer.hygieneProducts')}</li>
                 <li>{t('about.footer.cleaningProducts')}</li>
                 <li>{t('about.footer.homeDelivery')}</li>
                 <li>{t('about.footer.customerSupport')}</li>
                 <li>{t('about.footer.expertAdvice')}</li>
               </ul>
             </div>
            
                         <div>
               <h3 className="text-lg font-semibold mb-4">{t('about.footer.information')}</h3>
               <ul className="space-y-2 text-gray-400">
                 <li>{t('about.footer.aboutUs')}</li>
                 <li>{t('about.footer.ourValues')}</li>
                 <li>{t('about.footer.careers')}</li>
                 <li>{t('about.footer.privacyPolicy')}</li>
                 <li>{t('about.footer.termsOfUse')}</li>
               </ul>
             </div>
          </div>
          
                     <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
             <p>{t('about.footer.copyright')}</p>
           </div>
        </div>
      </section>
    </div>
  );
}
