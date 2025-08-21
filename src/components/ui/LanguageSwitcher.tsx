import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <div className="flex rounded-md border">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={i18n.language === language.code ? 'default' : 'ghost'}
            size="sm"
            className="h-8 px-2 text-xs rounded-none first:rounded-l-md last:rounded-r-md"
            onClick={() => handleLanguageChange(language.code)}
          >
            <span className="mr-1">{language.flag}</span>
            {language.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
