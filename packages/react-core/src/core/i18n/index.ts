import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import en from './locales/en.json';
import fr from './locales/fr.json';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)


// Set up i18n instance
i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        fr: { translation: fr },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

  export default i18n;