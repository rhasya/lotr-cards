"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import type { Locale } from "@/lib/i18n"

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "ko",
  setLocale: () => {},
  toggleLocale: () => {},
})

const STORAGE_KEY = "lotr_cards_locale"
const COOKIE_KEY = "lotr_locale"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (saved === "ko" || saved === "en") {
        setLocaleState(saved)
      } else {
        // Check browser language
        const browserLang = navigator.language.toLowerCase()
        if (browserLang.startsWith("en")) {
          setLocaleState("en")
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
    try {
      localStorage.setItem(STORAGE_KEY, nextLocale)
      document.cookie = `${COOKIE_KEY}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
    } catch {
      // Ignore storage errors
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ko" ? "en" : "ko")
  }, [locale, setLocale])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
