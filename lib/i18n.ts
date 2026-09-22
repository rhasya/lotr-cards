import type { Card, SetInfo } from "@/lib/types"

export type Locale = "ko" | "en"

export const SPHERES_I18N: Record<string, { ko: string; en: string }> = {
  지도력: { ko: "지도력", en: "Leadership" },
  전술: { ko: "전술", en: "Tactics" },
  정신: { ko: "정신", en: "Spirit" },
  지식: { ko: "지식", en: "Lore" },
  중립: { ko: "중립", en: "Neutral" },
}

export const CARD_TYPES_I18N: Record<string, { ko: string; en: string }> = {
  영웅: { ko: "영웅", en: "Hero" },
  동료: { ko: "동료", en: "Ally" },
  부속: { ko: "부속", en: "Attachment" },
  사건: { ko: "사건", en: "Event" },
  적: { ko: "적", en: "Enemy" },
  장소: { ko: "장소", en: "Location" },
  배반: { ko: "배반", en: "Treachery" },
  퀘스트: { ko: "퀘스트", en: "Quest" },
}

export const STATS_I18N: Record<string, { ko: string; en: string }> = {
  threat: { ko: "위협", en: "Threat" },
  cost: { ko: "비용", en: "Cost" },
  hitpoints: { ko: "체력", en: "HP" },
  willpower: { ko: "의지", en: "Willpower" },
  attack: { ko: "공격", en: "Attack" },
  defense: { ko: "방어", en: "Defense" },
}

export const UI_I18N = {
  nav: {
    sets: { ko: "세트 목록", en: "Sets" },
    admin: { ko: "카드 관리", en: "Admin" },
  },
  home: {
    subtitle: {
      ko: "중간계의 모든 카드를 한 곳에서 찾아보세요.",
      en: "Explore all cards across Middle-earth in one place.",
    },
    searchPlaceholder: {
      ko: "카드 이름, 특성, 진영으로 검색...",
      en: "Search by card name, trait, sphere...",
    },
  },
  sets: {
    title: { ko: "확장 세트", en: "Sets" },
    subtitle: {
      ko: "The Lord of the Rings LCG의 확장 세트를 살펴보세요.",
      en: "Explore all expansion sets from The Lord of the Rings LCG.",
    },
    codeCol: { ko: "약자", en: "Code" },
    nameCol: { ko: "세트", en: "Set" },
    cardCount: {
      ko: (count: number) => `${count}장의 카드`,
      en: (count: number) => `${count} cards`,
    },
  },
  table: {
    card: { ko: "카드", en: "Card" },
    sphere: { ko: "계열", en: "Sphere" },
    type: { ko: "타입", en: "Type" },
    threat: { ko: "위협", en: "Threat" },
    willpower: { ko: "의지력", en: "Willpower" },
    attack: { ko: "공격력", en: "Attack" },
    defense: { ko: "방어력", en: "Defense" },
    hitpoints: { ko: "체력", en: "HP" },
    cost: { ko: "비용", en: "Cost" },
    number: { ko: "번호", en: "#" },
  },
  detail: {
    backToSets: { ko: "세트 목록", en: "All Sets" },
    traitsLabel: { ko: "특성:", en: "Traits:" },
    statsSection: { ko: "능력치", en: "Stats" },
    detailsSection: { ko: "세부 정보", en: "Card Details" },
    set: { ko: "세트", en: "Set" },
    number: { ko: "카드 번호", en: "Card Number" },
    code: { ko: "카드 코드", en: "Card Code" },
    imagePlaceholder: { ko: "이미지 준비 중", en: "Image not available" },
  },
} as const

export function getCardDisplayName(card: Card, locale: Locale): string {
  if (locale === "en" && card.nameEn) {
    return card.nameEn
  }
  return card.name
}

export function getCardSubName(card: Card, locale: Locale): string | undefined {
  if (locale === "en") {
    return card.name !== card.nameEn ? card.name : undefined
  }
  return card.nameEn
}

export function getCardTraits(card: Card, locale: Locale): string[] {
  if (locale === "en" && card.traitsEn && card.traitsEn.length > 0) {
    return card.traitsEn
  }
  return card.traits ?? []
}

export function getSphereName(sphere?: string, locale: Locale = "ko"): string {
  if (!sphere) return "-"
  return SPHERES_I18N[sphere]?.[locale] ?? sphere
}

export function getTypeName(type: string, locale: Locale = "ko"): string {
  return CARD_TYPES_I18N[type]?.[locale] ?? type
}

export function getSetName(
  set?: Pick<SetInfo, "name" | "nameEn">,
  locale: Locale = "ko"
): string {
  if (!set) return ""
  if (locale === "en" && set.nameEn) {
    return set.nameEn
  }
  return set.name
}
