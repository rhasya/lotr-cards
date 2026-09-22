import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ChevronLeftIcon,
  CircleDollarSignIcon,
  FlameIcon,
  HeartIcon,
  ShieldIcon,
  SunIcon,
  SwordsIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RingMark } from "@/components/ring-mark"
import { getAllCards, getCard, setPath } from "@/lib/sets"

const sphereStyles: Record<string, string> = {
  지도력:
    "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300",
  지식: "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  정신: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  전술: "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  중립: "border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300",
}

const sphereGradients: Record<string, string> = {
  지도력:
    "from-purple-500/10 via-background to-background border-purple-500/20",
  지식: "from-green-500/10 via-background to-background border-green-500/20",
  정신: "from-blue-500/10 via-background to-background border-blue-500/20",
  전술: "from-red-500/10 via-background to-background border-red-500/20",
  중립: "from-neutral-500/10 via-background to-background border-neutral-500/20",
}

export function generateStaticParams() {
  return getAllCards().map((card) => ({ code: card.code.toLowerCase() }))
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string
  value?: number
  icon?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/30 p-3.5 text-center transition-colors">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span className="mt-1 text-2xl font-bold tabular-nums tracking-tight">
        {value !== undefined ? value : "-"}
      </span>
    </div>
  )
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

  const { card, set } = result
  const gradientClass =
    (card.sphere && sphereGradients[card.sphere]) ||
    "from-muted/40 via-background to-background border-border"

  const backUrl = set ? setPath(set.code) : "/sets"
  const backLabel = set ? `${set.name} (${set.code})` : "세트 목록"

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href={backUrl} />}
        className="mb-8"
      >
        <ChevronLeftIcon data-icon="inline-start" />
        {backLabel}
      </Button>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start">
        {/* Left Column: Card Image Placeholder */}
        <div className="mx-auto w-full max-w-sm md:col-span-5">
          <div
            className={`relative flex aspect-[5/7] w-full flex-col justify-between rounded-2xl border bg-gradient-to-b p-6 shadow-sm ${gradientClass}`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono font-medium">{card.code}</span>
              <span>#{card.number}</span>
            </div>

            {/* Center icon / placeholder artwork */}
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="relative flex size-24 items-center justify-center rounded-full border border-border/60 bg-muted/40 p-4 shadow-inner">
                <RingMark className="size-16 text-primary/80" />
              </div>
              <p className="text-xs text-muted-foreground/80">이미지 준비 중</p>
            </div>

            {/* Bottom row */}
            <div className="space-y-1 rounded-xl border border-border/40 bg-background/60 p-3 backdrop-blur-sm">
              <p className="truncate text-sm font-semibold">{card.name}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{card.type}</span>
                {card.sphere && <span>{card.sphere}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Card Details */}
        <div className="flex flex-col gap-6 md:col-span-7">
          {/* Card Header & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-normal">
                {card.type}
              </Badge>
              {card.sphere && (
                <Badge variant="outline" className={sphereStyles[card.sphere]}>
                  {card.sphere}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {card.name}
            </h1>

            {/* Traits */}
            {card.traits && card.traits.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs font-medium text-muted-foreground">
                  특성:
                </span>
                {card.traits.map((trait) => (
                  <Badge
                    key={trait}
                    variant="secondary"
                    className="px-2.5 py-0.5 text-xs font-medium"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Stat Cards (3x2 Grid)
              행 1: 위협 | 비용 | 체력
              행 2: 의지 | 공격 | 방어
          */}
          <div className="space-y-2">
            <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              능력치 (Stats)
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {/* Row 1: 위협 | 비용 | 체력 */}
              <StatBox
                label="위협"
                value={card.threat}
                icon={<FlameIcon className="size-3.5 text-orange-500" />}
              />
              <StatBox
                label="비용"
                value={card.cost}
                icon={<CircleDollarSignIcon className="size-3.5 text-yellow-500" />}
              />
              <StatBox
                label="체력"
                value={card.hitpoints}
                icon={<HeartIcon className="size-3.5 text-rose-500" />}
              />

              {/* Row 2: 의지 | 공격 | 방어 */}
              <StatBox
                label="의지"
                value={card.willpower}
                icon={<SunIcon className="size-3.5 text-amber-500" />}
              />
              <StatBox
                label="공격"
                value={card.attack}
                icon={<SwordsIcon className="size-3.5 text-red-500" />}
              />
              <StatBox
                label="방어"
                value={card.defense}
                icon={<ShieldIcon className="size-3.5 text-blue-500" />}
              />
            </div>
          </div>

          {/* Meta Information */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <h2 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              세부 정보
            </h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">세트</dt>
                <dd className="mt-0.5 font-medium">
                  {set ? (
                    <Link
                      href={setPath(set.code)}
                      className="text-primary hover:underline"
                    >
                      {set.name} ({set.code})
                    </Link>
                  ) : (
                    card.set
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">카드 번호</dt>
                <dd className="mt-0.5 font-medium">#{card.number}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">카드 코드</dt>
                <dd className="mt-0.5 font-mono text-xs font-medium">
                  {card.code}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  )
}
