export type SetInfo = {
  code: string
  name: string
  nameEn?: string
}

export type Card = {
  code: string
  number: number
  name: string
  nameEn?: string
  type: string
  sphere?: string
  traits?: string[]
  traitsEn?: string[]
  text?: string
  textEn?: string
  flavor?: string
  flavorEn?: string
  unique?: boolean
  cost?: number
  threat?: number
  willpower?: number
  attack?: number
  defense?: number
  hitpoints?: number
  set: string
}

export type Set = SetInfo & { cards: Card[] }

export function setPath(code: string): string {
  return `/sets/${code.toLowerCase()}`
}

export function cardPath(code: string): string {
  return `/cards/${code.toLowerCase()}`
}
