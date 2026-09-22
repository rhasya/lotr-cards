import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { setPath, sets } from "@/lib/sets"

export default function SetsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sets</h1>
        <p className="text-sm text-muted-foreground">
          The Lord of the Rings LCG의 확장 세트를 살펴보세요.
        </p>
      </div>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">약자</TableHead>
            <TableHead>세트</TableHead>
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
                  {set.name}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}