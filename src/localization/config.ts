import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEn from "./locales/en/common.json";
import commonRu from "./locales/ru/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: commonEn,
    },
    ru: {
      common: commonRu,
    },
  },
  lng: "en",
  fallbackLng: "en",
  debug: true,
  ns: ["common"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
