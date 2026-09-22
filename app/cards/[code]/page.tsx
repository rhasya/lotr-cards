import { notFound } from "next/navigation"

import { CardDetailView } from "@/components/card-detail-view"
import { getAllCards, getCard } from "@/lib/sets"

export function generateStaticParams() {
  return getAllCards().map((card) => ({ code: card.code.toLowerCase() }))
}

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const result = getCard(code)

  if (!result) {
    notFound()
  }

  return <CardDetailView card={result.card} set={result.set} />
}
