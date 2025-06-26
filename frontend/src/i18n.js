import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import deTranslation from './locales/de/translation.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      de: {
        translation: deTranslation,
      },
    },
  });

export default i18n; 