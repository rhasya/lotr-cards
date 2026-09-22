"use client"

import { GlobeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export function LanguageToggle() {
  const { locale, toggleLocale } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="h-8 gap-1.5 px-2 text-xs font-semibold"
      aria-label={`현재 언어: ${locale === "ko" ? "한국어" : "English"}. 클릭하여 ${locale === "ko" ? "English" : "한국어"}로 변경`}
      title={locale === "ko" ? "Switch to English" : "한국어로 변경"}
    >
      <GlobeIcon className="size-3.5 text-muted-foreground" />
      <span>{locale.toUpperCase()}</span>
    </Button>
  )
}
