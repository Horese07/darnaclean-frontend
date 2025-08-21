import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { SocialLoginButtons } from './SocialLoginButtons';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, googleLogin, facebookLogin, appleLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        onSuccess?.();
      } else {
        setError(t('auth.invalidCredentials'));
      }
    } catch (err) {
      setError(t('auth.loginError'));
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
        <CardTitle className="text-2xl font-bold text-center">{t('auth.welcomeBack')}</CardTitle>
        <CardDescription className="text-center">
          {t('auth.enterCredentials')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.signingIn')}
              </>
            ) : (
              t('auth.signIn')
            )}
          </Button>

          <SocialLoginButtons
            onGoogleLogin={handleGoogleLogin}
            onFacebookLogin={handleFacebookLogin}
            onAppleLogin={handleAppleLogin}
            isLoading={isLoading}
          />

          {onSwitchToRegister && (
            <div className="text-center text-sm">
              {t('auth.dontHaveAccount')}{' '}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={onSwitchToRegister}
              >
                {t('auth.signUp')}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
