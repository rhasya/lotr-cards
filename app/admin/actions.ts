"use server"

import { revalidatePath } from "next/cache"
import { deleteCard, saveCard, type Card } from "@/lib/sets"

export type ActionResponse = {
  success: boolean
  error?: string
}

export async function saveCardAction(
  cardData: Card,
  originalCode?: string
): Promise<ActionResponse> {
  const result = saveCard(cardData, originalCode)
  if (result.success) {
    revalidatePath("/admin")
    revalidatePath("/sets")
    revalidatePath(`/sets/${cardData.set.toLowerCase()}`)
    revalidatePath(`/cards/${cardData.code.toLowerCase()}`)
    if (originalCode && originalCode.toLowerCase() !== cardData.code.toLowerCase()) {
      revalidatePath(`/cards/${originalCode.toLowerCase()}`)
    }
    revalidatePath("/")
  }
  return result
}

export async function deleteCardAction(
  code: string,
  setCode?: string
): Promise<ActionResponse> {
  const result = deleteCard(code)
  if (result.success) {
    revalidatePath("/admin")
    revalidatePath("/sets")
    if (setCode) {
      revalidatePath(`/sets/${setCode.toLowerCase()}`)
    }
    revalidatePath(`/cards/${code.toLowerCase()}`)
    revalidatePath("/")
  }
  return result
}
