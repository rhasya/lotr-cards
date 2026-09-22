import { cn } from "@/lib/utils"

export function UniqueMark({
  className,
  title = "고유 카드 (Unique)",
}: {
  className?: string
  title?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-bold text-amber-500 select-none dark:text-amber-400",
        className
      )}
      title={title}
      aria-label={title}
    >
      ✦
    </span>
  )
}
