import Link from "next/link"

import { Button } from "@/components/ui/button"
import { RingMark } from "@/components/ring-mark"

export function SiteNavbar() {
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
            Sets
          </Button>
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="/admin" />}
          >
            카드 관리
          </Button>
        </nav>
      </div>
    </header>
  )
}
