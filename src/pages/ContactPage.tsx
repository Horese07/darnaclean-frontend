import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';

export function ContactPage() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    newsletter: false,
    terms: false
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (formData.firstName && formData.email && formData.message) {
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        newsletter: false,
        terms: false
      });
    } else {
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.contactInfo.address'),
      content: '123 Boulevard Mohammed V, Casablanca 20000, Maroc',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Phone,
      title: t('contact.contactInfo.phone'),
      content: '+212 775-177029',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Mail,
      title: t('contact.contactInfo.email'),
      content: 'darnaclean@gmail.com',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Clock,
      title: t('contact.contactInfo.hours'),
      content: 'Lun-Sam: 8h-20h | Dim: 9h-18h',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const subjects = [
    t('contact.subjects.infoRequest'),
    t('contact.subjects.support'),
    t('contact.subjects.complaint'),
    t('contact.subjects.partnership'),
    t('contact.subjects.recruitment'),
    t('contact.subjects.other')
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mb-6">
            <MessageSquare className="w-3 h-3 mr-1" />
            {t('contact.hero.badge')}
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t('contact.hero.title')}
          </h1>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.contactInfo.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('contact.contactInfo.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${info.color}`}>
                    <info.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{info.content}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{t('contact.form.title')}</CardTitle>
                  <CardDescription>
                    {t('contact.form.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t('contact.form.firstName')} *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t('contact.form.lastName')}</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contact.form.email')} *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('contact.form.phone')}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('contact.form.subject')} *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => handleChange('subject', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject, index) => (
                            <SelectItem key={index} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.form.message')} *</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder={t('contact.form.messagePlaceholder')}
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="newsletter"
                          checked={formData.newsletter}
                          onCheckedChange={(checked) => handleChange('newsletter', checked as boolean)}
                        />
                        <Label htmlFor="newsletter" className="text-sm">
                          {t('contact.form.newsletter')}
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.terms}
                          onCheckedChange={(checked) => handleChange('terms', checked as boolean)}
                          required
                        />
                        <Label htmlFor="terms" className="text-sm">
                          {t('contact.form.terms')} *
                        </Label>
                      </div>
                    </div>

                    {/* Submit Status */}
                    {submitStatus === 'success' && (
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
                        <CheckCircle className="w-5 h-5" />
                        <span>{t('contact.form.success')}</span>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                        <AlertCircle className="w-5 h-5" />
                        <span>{t('contact.form.error')}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.terms}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{t('contact.form.sending')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-5 h-5" />
                          <span>{t('contact.form.sendMessage')}</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-6">
              {/* Map Placeholder */}
                             <Card>
                 <CardHeader>
                   <CardTitle>{t('contact.map.title')}</CardTitle>
                   <CardDescription>
                     {t('contact.map.subtitle')}
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                     <div className="text-center text-gray-500">
                       <MapPin className="w-16 h-16 mx-auto mb-4" />
                       <p>{t('contact.map.interactiveMap')}</p>
                       <p className="text-sm">{t('contact.map.address')}</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>

              {/* Social Media */}
                             <Card>
                 <CardHeader>
                   <CardTitle>{t('contact.social.title')}</CardTitle>
                   <CardDescription>
                     {t('contact.social.subtitle')}
                   </CardDescription>
                 </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <a href="#" className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <Facebook className="w-6 h-6 text-blue-600" />
                      <span className="text-blue-600 font-medium">Facebook</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors">
                      <Instagram className="w-6 h-6 text-pink-600" />
                      <span className="text-pink-600 font-medium">Instagram</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors">
                      <Twitter className="w-6 h-6 text-sky-600" />
                      <span className="text-sky-600 font-medium">Twitter</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <Linkedin className="w-6 h-6 text-blue-700" />
                      <span className="text-blue-700 font-medium">LinkedIn</span>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
                             <Card>
                 <CardHeader>
                   <CardTitle>{t('contact.faq.title')}</CardTitle>
                   <CardDescription>
                     {t('contact.faq.subtitle')}
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                     <a href="#" className="block text-emerald-600 hover:text-emerald-700 transition-colors">
                       {t('contact.faq.howToOrder')}
                     </a>
                     <a href="#" className="block text-emerald-600 hover:text-emerald-700 transition-colors">
                       {t('contact.faq.deliveryTime')}
                     </a>
                     <a href="#" className="block text-emerald-600 hover:text-emerald-700 transition-colors">
                       {t('contact.faq.howToReturn')}
                     </a>
                     <a href="#" className="block text-emerald-600 hover:text-emerald-700 transition-colors">
                       {t('contact.faq.paymentMethods')}
                     </a>
                   </div>
                 </CardContent>
               </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('contact.cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('contact.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+212775177029">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 text-lg px-8 py-3">
                <Phone className="w-5 h-5 mr-2" />
                {t('contact.cta.callUs')}
              </Button>
            </a>
            <a href="mailto:darnaclean@gmail.com">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-emerald-700 text-lg px-8 py-3">
                <Mail className="w-5 h-5 mr-2" />
                {t('contact.cta.sendEmail')}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
