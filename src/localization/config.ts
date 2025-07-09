import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEn from "./locales/en/common.json";
import authEn from "./locales/en/auth.json";
import columnsEn from "./locales/en/columns.json";
import tasksEn from "./locales/en/tasks.json";

import commonRu from "./locales/ru/common.json";
import authRu from "./locales/ru/auth.json";
import columnsRu from "./locales/ru/columns.json";
import tasksRu from "./locales/ru/tasks.json";

export const supportedLanguages = [
  { code: "en", labelKey: "languageEnglish" },
  { code: "ru", labelKey: "languageRussian" },
];

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: commonEn,
      auth: authEn,
      columns: columnsEn,
      tasks: tasksEn,
    },
    ru: {
      common: commonRu,
      auth: authRu,
      columns: columnsRu,
      tasks: tasksRu,
    },
  },
  lng: "en",
  fallbackLng: ["en", "ru"],
  debug: true,
  ns: ["common", "auth", "columns", "tasks"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
