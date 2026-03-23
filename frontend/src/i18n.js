import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en.json"
import hi from "./locales/hi.json"
import mr from "./locales/mr.json"
import te from "./locales/te.json"
import kn from "./locales/kn.json"
import gu from "./locales/gu.json"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
    te: { translation: te },
    kn: { translation: kn },
    gu: { translation: gu }
  },
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
})

export default i18n
