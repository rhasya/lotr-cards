"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { RingMark } from "@/components/ring-mark"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"
import { UI_I18N } from "@/lib/i18n"

export function SiteNavbar() {
  const { locale } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <RingMark className="size-5 text-primary" />
          <span>The Lord of the Rings</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="/sets" />}
          >
            {UI_I18N.nav.sets[locale]}
          </Button>
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="/admin" />}
          >
            {UI_I18N.nav.admin[locale]}
          </Button>
          <div className="ml-1 border-l pl-1">
            <LanguageToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
