import { CardSearchForm } from "@/components/card-search-form"
import { HomeSubtitle } from "@/components/home-subtitle"
import { RingMark } from "@/components/ring-mark"

export default function Page() {
  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center gap-10 px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <RingMark className="size-12 text-primary" />
        <h1 className="flex flex-wrap items-baseline justify-center gap-x-2 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          The Lord of the Rings
          <span className="text-base font-medium text-muted-foreground sm:text-xl">
            [LCG]
          </span>
        </h1>
        <HomeSubtitle />
      </div>

      <CardSearchForm />
    </main>
  )
}