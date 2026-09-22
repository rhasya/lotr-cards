import { getAllCards, getSets } from "@/lib/sets"
import { AdminCardManager } from "@/components/admin-card-manager"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "카드 관리 | The Lord of the Rings LCG",
  description: "카드 데이터 추가, 수정, 삭제 관리자 페이지",
}

export default function AdminPage() {
  const cards = getAllCards()
  const sets = getSets()

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <AdminCardManager initialCards={cards} sets={sets} />
    </main>
  )
}
