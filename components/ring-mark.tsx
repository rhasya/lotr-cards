export function RingMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle
        cx="24"
        cy="24"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
    </svg>
  )
}