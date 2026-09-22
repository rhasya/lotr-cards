import { notFound } from "next/navigation"

import { SetCardsView } from "@/components/set-cards-view"
import { getSet, getSets } from "@/lib/sets"

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

  return <SetCardsView set={set} />
}