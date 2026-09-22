import Link from "next/link"
import { ChevronLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getSet, sets } from "@/lib/sets"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return sets.map((set) => ({ code: set.code.toLowerCase() }))
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
      <Button variant="ghost" size="sm" render={<Link href="/sets" />}>
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
            <TableHead className="w-28">약자</TableHead>
            <TableHead>카드</TableHead>
            <TableHead>타입</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {set.cards.map((card) => (
            <TableRow key={card.code}>
              <TableCell className="font-mono text-muted-foreground">
                {card.code}
              </TableCell>
              <TableCell className="font-medium">{card.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {card.type}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}