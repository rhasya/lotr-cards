import type { Card, SetInfo } from "@/lib/types"

export type Locale = "ko" | "en"

export type SphereDef = {
  ko: string
  en: string
  aliases?: string[]
}

export type CardTypeDef = {
  ko: string
  en: string
  aliases?: string[]
}

export const SPHERES_I18N: Record<string, SphereDef> = {
  Leadership: { ko: "지도력", en: "Leadership", aliases: ["지도력"] },
  Tactics: { ko: "전술", en: "Tactics", aliases: ["전술"] },
  Spirit: { ko: "정신", en: "Spirit", aliases: ["정신"] },
  Lore: { ko: "지식", en: "Lore", aliases: ["지식"] },
  Neutral: { ko: "중립", en: "Neutral", aliases: ["중립"] },
}

export const CARD_TYPES_I18N: Record<string, CardTypeDef> = {
  Hero: { ko: "영웅", en: "Hero", aliases: ["영웅"] },
  Ally: { ko: "동료", en: "Ally", aliases: ["동료"] },
  Attachment: { ko: "부착물", en: "Attachment", aliases: ["부착물", "부속"] },
  Event: { ko: "사건", en: "Event", aliases: ["사건"] },
  Enemy: { ko: "적", en: "Enemy", aliases: ["적"] },
  Location: { ko: "장소", en: "Location", aliases: ["장소"] },
  Treachery: { ko: "배반", en: "Treachery", aliases: ["배반"] },
  Quest: { ko: "퀘스트", en: "Quest", aliases: ["퀘스트"] },
}

export const STATS_I18N: Record<string, { ko: string; en: string }> = {
  threat: { ko: "위협", en: "Threat" },
  cost: { ko: "비용", en: "Cost" },
  hitpoints: { ko: "체력", en: "HP" },
  willpower: { ko: "의지", en: "Willpower" },
  attack: { ko: "공격", en: "Attack" },
  defense: { ko: "방어", en: "Defense" },
}

export type TraitDef = {
  ko: string
  en: string
  aliases?: string[]
}

/**
 * 영어 키 기반 반지의 제왕 LCG 공식 특성(Trait) 용어사전
 */
export const TRAITS_I18N: Record<string, TraitDef> = {
  // 종족 / 혈통 (Races & Lineages)
  Dunedain: { ko: "두네다인", en: "Dúnedain" },
  Dwarf: { ko: "드워프", en: "Dwarf", aliases: ["난쟁이"] },
  Silvan: { ko: "실반", en: "Silvan", aliases: ["숲요정", "우드엘프"] },
  Noldor: { ko: "놀도르", en: "Noldor" },
  Hobbit: { ko: "호빗", en: "Hobbit" },
  Ent: { ko: "엔트", en: "Ent" },
  Eagle: { ko: "독수리", en: "Eagle" },
  Orc: { ko: "오크", en: "Orc" },
  Goblin: { ko: "고블린", en: "Goblin" },
  Troll: { ko: "트롤", en: "Troll" },
  Nazgul: { ko: "나즈굴", en: "Nazgûl" },
  Undead: { ko: "언데드", en: "Undead" },
  Spider: { ko: "거미", en: "Spider" },
  Creature: { ko: "피조물", en: "Creature" },
  Giant: { ko: "거인", en: "Giant" },
  Dragon: { ko: "용", en: "Dragon" },
  Wose: { ko: "우오스", en: "Wose" },

  // 세력 / 지역 (Realms & Regions)
  Gondor: { ko: "곤도르", en: "Gondor" },
  Rohan: { ko: "로한", en: "Rohan" },
  Dale: { ko: "데일", en: "Dale" },
  Bree: { ko: "브리", en: "Bree" },
  Shire: { ko: "샤이어", en: "Shire" },
  Lothlorien: { ko: "로스로리엔", en: "Lothlórien" },
  Rivendell: { ko: "리븐델", en: "Rivendell" },
  Erebor: { ko: "에레보르", en: "Erebor" },
  Esgaroth: { ko: "에스가로스", en: "Esgaroth" },
  Mordor: { ko: "모르도르", en: "Mordor" },
  Isengard: { ko: "아이센가드", en: "Isengard" },
  DolGuldur: { ko: "돌 굴두르", en: "Dol Guldur" },
  Mirkwood: { ko: "어둠숲", en: "Mirkwood" },
  Harad: { ko: "하라드", en: "Harad" },

  // 직업 / 신분 / 속성 (Roles, Titles & Attributes)
  Noble: { ko: "귀족", en: "Noble" },
  Ranger: { ko: "순찰자", en: "Ranger" },
  Warrior: { ko: "전사", en: "Warrior" },
  Scout: { ko: "정찰병", en: "Scout" },
  Steward: { ko: "섭정", en: "Steward" },
  Istari: { ko: "마법사", en: "Istari" },
  Minstrel: { ko: "음유시인", en: "Minstrel" },
  Healer: { ko: "치유사", en: "Healer" },
  Craftsman: { ko: "목수", en: "Craftsman" },
  Outrider: { ko: "기수", en: "Outrider" },
  Leader: { ko: "지도자", en: "Leader" },
  RingBearer: { ko: "반지 운반자", en: "Ring-bearer" },
  Vanguard: { ko: "선봉장", en: "Vanguard" },
  Woodman: { ko: "숲사람", en: "Woodman" },
  Archer: { ko: "궁수", en: "Archer" },
  Knight: { ko: "기사", en: "Knight" },
  Pony: { ko: "조랑말", en: "Pony" },
  Mount: { ko: "탈것", en: "Mount" },
  Weapon: { ko: "무기", en: "Weapon" },
  Armor: { ko: "갑옷", en: "Armor" },
  Item: { ko: "물품", en: "Item" },
  Artifact: { ko: "유물", en: "Artifact" },
  Title: { ko: "칭호", en: "Title" },
  Skill: { ko: "기술", en: "Skill" },
  Song: { ko: "노래", en: "Song" },
  Condition: { ko: "상태", en: "Condition" },
}

export type TraitKey = keyof typeof TRAITS_I18N

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
    traits: { ko: "특성", en: "Traits" },
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

function normalizeText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

/**
 * 한글, 영문, 또는 키값 중 어떤 문자열이 들어오더라도
 * 대상 언어(ko / en)의 공식 표기로 자동 번역 및 정규화합니다.
 */
export function translateTrait(input: string, targetLocale: Locale): string {
  const normalized = normalizeText(input)
  if (!normalized) return input

  for (const [key, val] of Object.entries(TRAITS_I18N)) {
    const matchesKey = normalizeText(key) === normalized
    const matchesEn = normalizeText(val.en) === normalized
    const matchesKo = normalizeText(val.ko) === normalized
    const matchesAlias = val.aliases?.some(
      (a) => normalizeText(a) === normalized
    )

    if (matchesKey || matchesEn || matchesKo || matchesAlias) {
      return val[targetLocale]
    }
  }

  return input
}

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
  if (locale === "en") {
    if (card.traitsEn && card.traitsEn.length > 0) {
      return card.traitsEn
    }
    return (card.traits ?? []).map((t) => translateTrait(t, "en"))
  }

  // locale === "ko"
  if (card.traits && card.traits.length > 0) {
    return card.traits
  }
  return (card.traitsEn ?? []).map((t) => translateTrait(t, "ko"))
}

export function normalizeSphere(input?: string): string | undefined {
  if (!input || input === "none") return undefined
  const norm = normalizeText(input)
  for (const [key, val] of Object.entries(SPHERES_I18N)) {
    if (
      normalizeText(key) === norm ||
      normalizeText(val.en) === norm ||
      normalizeText(val.ko) === norm ||
      val.aliases?.some((a) => normalizeText(a) === norm)
    ) {
      return key
    }
  }
  return input
}

export function normalizeType(input: string): string {
  const norm = normalizeText(input)
  for (const [key, val] of Object.entries(CARD_TYPES_I18N)) {
    if (
      normalizeText(key) === norm ||
      normalizeText(val.en) === norm ||
      normalizeText(val.ko) === norm ||
      val.aliases?.some((a) => normalizeText(a) === norm)
    ) {
      return key
    }
  }
  return input
}

export function getSphereName(sphere?: string, locale: Locale = "ko"): string {
  if (!sphere) return "-"
  const key = normalizeSphere(sphere)
  if (!key) return "-"
  const entry = SPHERES_I18N[key as keyof typeof SPHERES_I18N]
  return entry ? entry[locale] : sphere
}

export function getTypeName(type: string, locale: Locale = "ko"): string {
  const key = normalizeType(type)
  const entry = CARD_TYPES_I18N[key as keyof typeof CARD_TYPES_I18N]
  return entry ? entry[locale] : type
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
