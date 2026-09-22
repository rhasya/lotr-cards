import React from "react"
import { cn } from "@/lib/utils"

interface FormattedCardTextProps {
  text?: string
  className?: string
}

export function FormattedCardText({ text, className }: FormattedCardTextProps) {
  if (!text) return null

  // Matches **bold**, <b>bold</b>, *italic*, <i>italic</i>
  const regex = /(\*\*[\s\S]*?\*\*|<b>[\s\S]*?<\/b>|\*[^*\n]+?\*|<i>[\s\S]*?<\/i>)/g
  const parts = text.split(regex)

  return (
    <div className={cn("whitespace-pre-line leading-relaxed", className)}>
      {parts.map((part, index) => {
        if (!part) return null

        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <strong
              key={index}
              className="font-semibold text-foreground"
            >
              {part.slice(2, -2)}
            </strong>
          )
        }

        if (part.startsWith("<b>") && part.endsWith("</b>") && part.length >= 7) {
          return (
            <strong
              key={index}
              className="font-semibold text-foreground"
            >
              {part.slice(3, -4)}
            </strong>
          )
        }

        if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
          return (
            <em key={index} className="italic">
              {part.slice(1, -1)}
            </em>
          )
        }

        if (part.startsWith("<i>") && part.endsWith("</i>") && part.length >= 7) {
          return (
            <em key={index} className="italic">
              {part.slice(3, -4)}
            </em>
          )
        }

        return <React.Fragment key={index}>{part}</React.Fragment>
      })}
    </div>
  )
}
