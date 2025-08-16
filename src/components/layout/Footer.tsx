import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Facebook, href: '#', label: t('footer.facebook') },
    { icon: Instagram, href: '#', label: t('footer.instagram') },
    { icon: Twitter, href: '#', label: t('footer.twitter') },
    { icon: Youtube, href: '#', label: t('footer.youtube') },
  ];

  const quickLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const customerServiceLinks = [
    { href: '/help', label: t('footer.helpCenter') },
    { href: '/shipping', label: t('footer.shipping') },
    { href: '/returns', label: t('footer.returns') },
    { href: '/track-order', label: t('footer.trackOrder') },
  ];

  const legalLinks = [
    { href: '/legal', label: t('footer.legal') },
    { href: '/privacy', label: t('footer.privacy') },
    { href: '/terms', label: t('footer.terms') },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">DC</span>
              </div>
              <span className="text-xl font-bold">DarnaClean</span>
            </div>
            <p className="text-gray-300 text-sm">
              {t('footer.aboutText')}
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Casablanca, Maroc</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+212 5 22 XX XX XX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>contact@darnaclean.ma</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Lun-Sam: 8h-18h</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.customerService')}</h3>
            <ul className="space-y-2">
              {customerServiceLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.newsletter')}</h3>
            <p className="text-gray-300 text-sm">
              {t('footer.newsletterText')}
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                {t('footer.subscribe')}
              </Button>
            </form>

            {/* Social links */}
            <div className="space-y-3">
              <h4 className="font-medium">{t('footer.followUs')}</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            {t('footer.copyright')}
          </p>
          
          {/* Legal links */}
          <div className="flex space-x-6">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold">SSL</span>
              </div>
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold">24h</span>
              </div>
              <span>Livraison rapide</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold">★</span>
              </div>
              <span>Service client de qualité</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
