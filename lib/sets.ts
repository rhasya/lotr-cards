import "server-only"

import { readFileSync, writeFileSync, watch } from "node:fs"
import { join } from "node:path"

import { z } from "zod"

const setSchema = z.object({
  code: z.string(),
  name: z.string(),
})

export const cardSchema = z.preprocess(
  (input) => {
    if (typeof input === "object" && input !== null) {
      const raw = input as Record<string, unknown>
      if (typeof raw.traits === "string") {
        const parsed = raw.traits
          .split(/[,.]/)
          .map((s) => s.trim())
          .filter(Boolean)
        return { ...raw, traits: parsed.length > 0 ? parsed : undefined }
      }
      if (raw.trait !== undefined && raw.traits === undefined) {
        if (Array.isArray(raw.trait)) {
          return { ...raw, traits: raw.trait }
        }
        if (typeof raw.trait === "string") {
          const parsed = raw.trait
            .split(/[,.]/)
            .map((s) => s.trim())
            .filter(Boolean)
          return { ...raw, traits: parsed.length > 0 ? parsed : undefined }
        }
      }
    }
    return input
  },
  z.object({
    code: z.string().min(1, "카드 코드를 입력해주세요"),
    number: z.number().int(),
    name: z.string().min(1, "카드명을 입력해주세요"),
    type: z.string().min(1, "타입을 입력해주세요"),
    sphere: z.string().optional(),
    traits: z.array(z.string()).optional(),
    cost: z.number().int().optional(),
    threat: z.number().int().optional(),
    willpower: z.number().int().optional(),
    attack: z.number().int().optional(),
    defense: z.number().int().optional(),
    hitpoints: z.number().int().optional(),
    set: z.string().min(1, "세트를 선택해주세요"),
  })
)

export type SetInfo = z.infer<typeof setSchema>
export type Card = z.infer<typeof cardSchema>
export type Set = SetInfo & { cards: Card[] }

type Data = {
  sets: Set[]
  setsByCode: Map<string, SetInfo>
  cardsBySet: Map<string, Card[]>
  allCards: Card[]
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

function writeJsonl(filePath: string, items: unknown[]): void {
  const content = items.map((item) => JSON.stringify(item)).join("\n") + "\n"
  writeFileSync(filePath, content, "utf8")
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
    allCards: cardList,
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

export function getAllCards(): Card[] {
  return getData().allCards
}

export function getSet(code: string): Set | undefined {
  const { setsByCode, cardsBySet } = getData()
  const set = setsByCode.get(code.toLowerCase())
  if (!set) {
    return undefined
  }
  return { ...set, cards: cardsBySet.get(code.toLowerCase()) ?? [] }
}

export function getCard(
  code: string
): { card: Card; set?: SetInfo } | undefined {
  const { allCards, setsByCode } = getData()
  const card = allCards.find((c) => c.code.toLowerCase() === code.toLowerCase())
  if (!card) {
    return undefined
  }
  const set = setsByCode.get(card.set.toLowerCase())
  return { card, set }
}

export function setPath(code: string): string {
  return `/sets/${code.toLowerCase()}`
}

export function saveCard(
  cardData: Card,
  originalCode?: string
): { success: boolean; error?: string } {
  try {
    const validated = cardSchema.parse(cardData)
    const filePath = join(dataDir, "cards.jsonl")
    const cardList = z.array(cardSchema).parse(readJsonl(filePath))

    const isEdit = Boolean(originalCode)
    const existingIndex = isEdit
      ? cardList.findIndex(
          (c) => c.code.toLowerCase() === originalCode?.toLowerCase()
        )
      : -1

    // If adding new, or if code was changed during edit, check for duplicate
    if (
      !isEdit ||
      (originalCode &&
        originalCode.toLowerCase() !== validated.code.toLowerCase())
    ) {
      const duplicate = cardList.find(
        (c) => c.code.toLowerCase() === validated.code.toLowerCase()
      )
      if (duplicate) {
        return {
          success: false,
          error: `이미 존재하는 카드 코드입니다: ${validated.code}`,
        }
      }
    }

    if (isEdit && existingIndex >= 0) {
      cardList[existingIndex] = validated
    } else {
      cardList.push(validated)
    }

    // Sort cards by set, then number
    cardList.sort((a, b) => {
      if (a.set !== b.set) return a.set.localeCompare(b.set)
      return a.number - b.number
    })

    writeJsonl(filePath, cardList)
    data = null
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.",
    }
  }
}

export function deleteCard(code: string): { success: boolean; error?: string } {
  try {
    const filePath = join(dataDir, "cards.jsonl")
    const cardList = z.array(cardSchema).parse(readJsonl(filePath))

    const filtered = cardList.filter(
      (c) => c.code.toLowerCase() !== code.toLowerCase()
    )
    if (filtered.length === cardList.length) {
      return { success: false, error: "카드를 찾을 수 없습니다." }
    }

    writeJsonl(filePath, filtered)
    data = null
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.",
    }
  }
}
