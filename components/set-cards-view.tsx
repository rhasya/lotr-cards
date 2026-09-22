"use client"

import Link from "next/link"
import {
  ChevronLeftIcon,
  HeartIcon,
  ShieldIcon,
  SunIcon,
  SwordsIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UniqueMark } from "@/components/unique-mark"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useLanguage } from "@/components/language-provider"
import {
  getCardDisplayName,
  getCardSubName,
  getSetName,
  getSphereName,
  getTypeName,
  normalizeSphere,
  UI_I18N,
} from "@/lib/i18n"
import type { Set } from "@/lib/types"

const sphereStyles: Record<string, string> = {
  Leadership:
    "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300",
  Lore: "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  Spirit: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  Tactics: "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  Neutral: "border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300",
}

export function SetCardsView({ set }: { set: Set }) {
  const { locale } = useLanguage()

  const setName = getSetName(set, locale)

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/sets" />}
      >
        <ChevronLeftIcon data-icon="inline-start" />
        {UI_I18N.sets.title[locale]}
      </Button>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{setName}</h1>
          <span className="font-mono text-sm text-muted-foreground">
            {set.code}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {UI_I18N.sets.cardCount[locale](set.cards.length)}
        </p>
      </div>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>{UI_I18N.table.card[locale]}</TableHead>
            <TableHead>{UI_I18N.table.sphere[locale]}</TableHead>
            <TableHead>{UI_I18N.table.type[locale]}</TableHead>
            <TableHead className="text-right">{UI_I18N.table.threat[locale]}</TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center gap-1">
                <SunIcon className="size-3.5" aria-hidden="true" />
                {UI_I18N.table.willpower[locale]}
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center gap-1">
                <SwordsIcon className="size-3.5" aria-hidden="true" />
                {UI_I18N.table.attack[locale]}
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center gap-1">
                <ShieldIcon className="size-3.5" aria-hidden="true" />
                {UI_I18N.table.defense[locale]}
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center gap-1">
                <HeartIcon className="size-3.5" aria-hidden="true" />
                {UI_I18N.table.hitpoints[locale]}
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {set.cards.map((card) => {
            const displayName = getCardDisplayName(card, locale)
            const subName = getCardSubName(card, locale)
            const sphereKey = card.sphere ? normalizeSphere(card.sphere) : undefined
            const sphereName = card.sphere
              ? getSphereName(card.sphere, locale)
              : undefined
            const typeName = getTypeName(card.type, locale)

            return (
              <TableRow key={card.code}>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {card.unique && <UniqueMark className="text-xs" />}
                    <Link
                      href={`/cards/${card.code.toLowerCase()}`}
                      className="font-medium hover:underline"
                    >
                      {displayName}
                    </Link>
                    {subName && (
                      <span className="text-xs text-muted-foreground">
                        {subName}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {sphereKey && sphereName ? (
                    <Badge
                      variant="outline"
                      className={sphereStyles[sphereKey]}
                    >
                      {sphereName}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {typeName}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {card.threat ?? "-"}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {card.willpower ?? "-"}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {card.attack ?? "-"}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {card.defense ?? "-"}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {card.hitpoints ?? "-"}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </main>
  )
}
