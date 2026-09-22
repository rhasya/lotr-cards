import { CardSearchForm } from "@/components/card-search-form"
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
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          중간계의 모든 카드를 한 곳에서 찾아보세요.
        </p>
      </div>

      <CardSearchForm />
    </main>
  )
}