import Link from "next/link"
import { ChevronLeftIcon, HeartIcon, ShieldIcon, SunIcon, SwordsIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getSet, getSets } from "@/lib/sets"
import { notFound } from "next/navigation"

const sphereStyles: Record<string, string> = {
  지도력:
    "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300",
  지식: "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  정신: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  전술: "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
}

export function generateStaticParams() {
  return getSets().map((set) => ({ code: set.code.toLowerCase() }))
}

export default async function SetPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const set = getSet(code)

  if (!set) {
    notFound()
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/sets" />}
      >
        <ChevronLeftIcon data-icon="inline-start" />
        Sets
      </Button>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {set.name}
          </h1>
          <span className="font-mono text-sm text-muted-foreground">
            {set.code}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {set.cards.length}장의 카드
        </p>
      </div>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>카드</TableHead>
            <TableHead>계열</TableHead>
            <TableHead>타입</TableHead>
            <TableHead className="text-right">위협</TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center gap-1">
                <SunIcon className="size-3.5" aria-hidden="true" />
                의지력
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center gap-1">
                <SwordsIcon className="size-3.5" aria-hidden="true" />
                공격력
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center gap-1">
                <ShieldIcon className="size-3.5" aria-hidden="true" />
                방어력
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center gap-1">
                <HeartIcon className="size-3.5" aria-hidden="true" />
                체력
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {set.cards.map((card) => (
            <TableRow key={card.code}>
              <TableCell className="font-medium">
                <Link
                  href={`/cards/${card.code.toLowerCase()}`}
                  className="hover:underline"
                >
                  {card.name}
                </Link>
              </TableCell>
              <TableCell>
                {card.sphere ? (
                  <Badge variant="outline" className={sphereStyles[card.sphere]}>
                    {card.sphere}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {card.type}
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
          ))}
        </TableBody>
      </Table>
    </main>
  )
}