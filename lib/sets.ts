import "server-only"

import { readFileSync, watch } from "node:fs"
import { join } from "node:path"

import { z } from "zod"

const setSchema = z.object({
  code: z.string(),
  name: z.string(),
})

const cardSchema = z.object({
  code: z.string(),
  number: z.number().int(),
  name: z.string(),
  type: z.string(),
  sphere: z.string().optional(),
  set: z.string(),
})

export type SetInfo = z.infer<typeof setSchema>
export type Card = z.infer<typeof cardSchema>
export type Set = SetInfo & { cards: Card[] }

type Data = {
  sets: Set[]
  setsByCode: Map<string, SetInfo>
  cardsBySet: Map<string, Card[]>
}

const dataDir = join(process.cwd(), "data")
const dataFiles = ["sets.json", "cards.jsonl"]

function readJsonl(filePath: string): unknown[] {
  return readFileSync(filePath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line))
}

function load(): Data {
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

  return {
    sets: setList.map((set) => ({
      ...set,
      cards: cardsBySet.get(set.code.toLowerCase()) ?? [],
    })),
    setsByCode: new Map(setList.map((set) => [set.code.toLowerCase(), set])),
    cardsBySet,
  }
}

let data: Data | null = null
let watching = false

function getData(): Data {
  if (!data) {
    data = load()

    if (process.env.NODE_ENV === "development" && !watching) {
      watching = true
      for (const file of dataFiles) {
        try {
          watch(join(dataDir, file), () => {
            data = null
          })
        } catch {
          // Ignore missing/unsupported watch targets.
        }
      }
    }
  }

  return data
}

export function getSets(): Set[] {
  return getData().sets
}

export function getSet(code: string): Set | undefined {
  const { setsByCode, cardsBySet } = getData()
  const set = setsByCode.get(code.toLowerCase())
  if (!set) {
    return undefined
  }
  return { ...set, cards: cardsBySet.get(code.toLowerCase()) ?? [] }
}

export function setPath(code: string): string {
  return `/sets/${code.toLowerCase()}`
}