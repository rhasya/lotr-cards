import "server-only"

import { readFileSync } from "node:fs"
import { join } from "node:path"

import { z } from "zod"

const setSchema = z.object({
  code: z.string(),
  name: z.string(),
})

const cardSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: z.string(),
  set: z.string(),
})

export type SetInfo = z.infer<typeof setSchema>
export type Card = z.infer<typeof cardSchema>
export type Set = SetInfo & { cards: Card[] }

const dataDir = join(process.cwd(), "data")

function readJsonl(filePath: string): unknown[] {
  return readFileSync(filePath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line))
}

const setList = z
  .array(setSchema)
  .parse(JSON.parse(readFileSync(join(dataDir, "sets.json"), "utf8")))

const cardList = z
  .array(cardSchema)
  .parse(readJsonl(join(dataDir, "cards.jsonl")))

const cardsBySet = new Map<string, Card[]>()
for (const card of cardList) {
  const key = card.set.toLowerCase()
  const existing = cardsBySet.get(key)
  if (existing) {
    existing.push(card)
  } else {
    cardsBySet.set(key, [card])
  }
}

const setsByCode = new Map(setList.map((set) => [set.code.toLowerCase(), set]))

export const sets: Set[] = setList.map((set) => ({
  ...set,
  cards: cardsBySet.get(set.code.toLowerCase()) ?? [],
}))

export function getSet(code: string): Set | undefined {
  const set = setsByCode.get(code.toLowerCase())
  if (!set) {
    return undefined
  }
  return { ...set, cards: cardsBySet.get(code.toLowerCase()) ?? [] }
}

export function setPath(code: string): string {
  return `/sets/${code.toLowerCase()}`
}