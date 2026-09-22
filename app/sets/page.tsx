import { SetsListView } from "@/components/sets-list-view"
import { getSets } from "@/lib/sets"

export default function SetsPage() {
  const sets = getSets()

  return <SetsListView sets={sets} />
}