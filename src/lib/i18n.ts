import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';


// On laisse resources vide pour forcer le chargement dynamique via i18next-http-backend
const resources = undefined;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'fr', // langue par défaut
    fallbackLng: 'fr',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    resources,
    
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;
