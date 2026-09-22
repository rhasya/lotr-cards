"use client"

import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useLanguage } from "@/components/language-provider"
import { getSetName, UI_I18N } from "@/lib/i18n"
import type { Set } from "@/lib/types"
import { setPath } from "@/lib/types"

export function SetsListView({ sets }: { sets: Set[] }) {
  const { locale } = useLanguage()

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {UI_I18N.sets.title[locale]}
        </h1>
        <p className="text-sm text-muted-foreground">
          {UI_I18N.sets.subtitle[locale]}
        </p>
      </div>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">{UI_I18N.sets.codeCol[locale]}</TableHead>
            <TableHead>{UI_I18N.sets.nameCol[locale]}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets.map((set) => (
            <TableRow key={set.code}>
              <TableCell className="font-mono font-medium">
                {set.code}
              </TableCell>
              <TableCell>
                <Link
                  href={setPath(set.code)}
                  className="font-medium hover:underline"
                >
                  {getSetName(set, locale)}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
