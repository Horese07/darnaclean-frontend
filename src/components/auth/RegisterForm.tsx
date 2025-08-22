import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { SocialLoginButtons } from './SocialLoginButtons';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    date_of_birth: '',
    gender: '',
    preferred_language: 'en'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, googleLogin, facebookLogin, appleLogin } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.password_confirmation) {
      setError(t('auth.passwordsDontMatch'));
      return;
    }

    if (formData.password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        onSuccess?.();
      } else {
        // Afficher les erreurs de validation du backend
        if (result.errors && Object.keys(result.errors).length > 0) {
          const errorMessages = Object.values(result.errors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(result.message || t('auth.registrationFailed'));
        }
      }
    } catch (err) {
      setError(t('auth.registrationError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const success = await googleLogin();
      if (success) {
        onSuccess?.();
      } else {
        setError(t('auth.googleLoginError'));
      }
    } catch (err) {
      setError(t('auth.socialLoginError', { provider: 'Google' }));
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    try {
      const success = await facebookLogin();
      if (success) {
        onSuccess?.();
      } else {
        setError(t('auth.facebookLoginError'));
      }
    } catch (err) {
      setError(t('auth.socialLoginError', { provider: 'Facebook' }));
    }
  };

  const handleAppleLogin = async () => {
    setError('');
    try {
      const success = await appleLogin();
      if (success) {
        onSuccess?.();
      } else {
        setError(t('auth.appleLoginError'));
      }
    } catch (err) {
      setError(t('auth.socialLoginError', { provider: 'Apple' }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>
        <CardTitle className="text-2xl font-bold text-center">{t('auth.createAccount')}</CardTitle>
        <CardDescription className="text-center">
          {t('auth.enterInfo')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t('auth.firstName')}</Label>
              <Input
                id="first_name"
                placeholder={t('auth.firstNamePlaceholder')}
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">{t('auth.lastName')}</Label>
              <Input
                id="last_name"
                placeholder={t('auth.lastNamePlaceholder')}
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('auth.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t('auth.phonePlaceholder')}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">{t('auth.dateOfBirth')}</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">{t('auth.gender')}</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange('gender', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('auth.genderPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t('auth.male')}</SelectItem>
                  <SelectItem value="female">{t('auth.female')}</SelectItem>
                  <SelectItem value="other">{t('auth.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_language">{t('auth.preferredLanguage')}</Label>
            <Select
              value={formData.preferred_language}
              onValueChange={(value) => handleChange('preferred_language', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('auth.english')}</SelectItem>
                <SelectItem value="fr">{t('auth.french')}</SelectItem>
                <SelectItem value="ar">{t('auth.arabic')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.passwordPlaceholder')}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">{t('auth.confirmPassword')}</Label>
            <div className="relative">
              <Input
                id="password_confirmation"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                value={formData.password_confirmation}
                onChange={(e) => handleChange('password_confirmation', e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.registering')}
              </>
            ) : (
              t('auth.register')
            )}
          </Button>

          <SocialLoginButtons
            onGoogleLogin={handleGoogleLogin}
            onFacebookLogin={handleFacebookLogin}
            onAppleLogin={handleAppleLogin}
            isLoading={isLoading}
          />

          {onSwitchToLogin && (
            <div className="text-center text-sm">
              {t('auth.alreadyHaveAccount')}{' '}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={onSwitchToLogin}
              >
                {t('auth.signIn')}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
