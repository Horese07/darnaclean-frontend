import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

interface SocialLoginButtonsProps {
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  onAppleLogin: () => void;
  isLoading?: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGoogleLogin,
  onFacebookLogin,
  onAppleLogin,
  isLoading = false
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            {t('auth.orContinueWith')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="outline"
          onClick={onGoogleLogin}
          disabled={isLoading}
          className="w-full"
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          {t('auth.googleLogin')}
        </Button>

        <Button
          variant="outline"
          onClick={onFacebookLogin}
          disabled={isLoading}
          className="w-full"
          style={{ 
            backgroundColor: '#1877f2', 
            color: 'white',
            borderColor: '#1877f2'
          }}
        >
          <FaFacebook className="mr-2 h-4 w-4" />
          {t('auth.facebookLogin')}
        </Button>

        <Button
          variant="outline"
          onClick={onAppleLogin}
          disabled={isLoading}
          className="w-full"
          style={{ 
            backgroundColor: '#000000', 
            color: 'white',
            borderColor: '#000000'
          }}
        >
          <FaApple className="mr-2 h-4 w-4" />
          {t('auth.appleLogin')}
        </Button>
      </div>
    </div>
  );
};
