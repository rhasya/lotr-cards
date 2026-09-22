"use client"

import { useLanguage } from "@/components/language-provider"
import { UI_I18N } from "@/lib/i18n"

export function HomeSubtitle() {
  const { locale } = useLanguage()

  return (
    <p className="max-w-md text-sm text-muted-foreground sm:text-base">
      {UI_I18N.home.subtitle[locale]}
    </p>
  )
}
