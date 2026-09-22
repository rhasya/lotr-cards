"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  HeartIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ShieldIcon,
  SunIcon,
  SwordsIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Card, SetInfo } from "@/lib/types"
import { translateTrait } from "@/lib/i18n"
import { UniqueMark } from "@/components/unique-mark"
import { deleteCardAction, saveCardAction } from "@/app/admin/actions"

const sphereStyles: Record<string, string> = {
  지도력:
    "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300",
  지식: "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  정신: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  전술: "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  중립: "border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300",
}

const CARD_TYPES = [
  "영웅",
  "동료",
  "부속",
  "사건",
  "적",
  "장소",
  "배반",
  "퀘스트",
]
const SPHERES = ["지도력", "전술", "정신", "지식", "중립"]

interface AdminCardManagerProps {
  initialCards: Card[]
  sets: SetInfo[]
}

type CardFormData = {
  code: string
  number: string
  name: string
  nameEn: string
  type: string
  sphere: string
  traits: string
  traitsEn: string
  unique: boolean
  cost: string
  threat: string
  willpower: string
  attack: string
  defense: string
  hitpoints: string
  set: string
}

const emptyForm: CardFormData = {
  code: "",
  number: "",
  name: "",
  nameEn: "",
  type: "영웅",
  sphere: "none",
  traits: "",
  traitsEn: "",
  unique: true,
  cost: "",
  threat: "",
  willpower: "",
  attack: "",
  defense: "",
  hitpoints: "",
  set: "RCS",
}

export function AdminCardManager({
  initialCards,
  sets,
}: AdminCardManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Filter states
  const [search, setSearch] = useState("")
  const [setFilter, setSetFilter] = useState("all")
  const [sphereFilter, setSphereFilter] = useState("all")

  // Modal states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [formData, setFormData] = useState<CardFormData>(emptyForm)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Delete confirm state
  const [deletingCard, setDeletingCard] = useState<Card | null>(null)

  // Open modal for new card
  const handleOpenNewCard = () => {
    setEditingCard(null)
    const defaultSet = sets[0]?.code || "RCS"
    const nextNumber =
      initialCards.filter((c) => c.set === defaultSet).length + 1
    const nextCode = `${defaultSet}-${String(nextNumber).padStart(3, "0")}`

    setFormData({
      ...emptyForm,
      set: defaultSet,
      number: String(nextNumber),
      code: nextCode,
    })
    setErrorMessage(null)
    setDialogOpen(true)
  }

  // Open modal for editing card
  const handleOpenEditCard = (card: Card) => {
    setEditingCard(card)
    setFormData({
      code: card.code,
      number: String(card.number),
      name: card.name,
      nameEn: card.nameEn || "",
      type: card.type,
      sphere: card.sphere || "none",
      traits: card.traits ? card.traits.join(", ") : "",
      traitsEn: card.traitsEn ? card.traitsEn.join(", ") : "",
      unique: Boolean(card.unique),
      cost: card.cost !== undefined ? String(card.cost) : "",
      threat: card.threat !== undefined ? String(card.threat) : "",
      willpower: card.willpower !== undefined ? String(card.willpower) : "",
      attack: card.attack !== undefined ? String(card.attack) : "",
      defense: card.defense !== undefined ? String(card.defense) : "",
      hitpoints: card.hitpoints !== undefined ? String(card.hitpoints) : "",
      set: card.set,
    })
    setErrorMessage(null)
    setDialogOpen(true)
  }

  // Handle Set or Number change for auto-generating code in new card mode
  const handleSetChange = (newSet: string | null) => {
    if (!newSet) return
    setFormData((prev) => {
      const updated = { ...prev, set: newSet }
      if (!editingCard && prev.number) {
        const num = parseInt(prev.number, 10)
        if (!isNaN(num)) {
          updated.code = `${newSet}-${String(num).padStart(3, "0")}`
        }
      }
      return updated
    })
  }

  const handleNumberChange = (value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, number: value }
      if (!editingCard) {
        const num = parseInt(value, 10)
        if (!isNaN(num)) {
          updated.code = `${prev.set}-${String(num).padStart(3, "0")}`
        }
      }
      return updated
    })
  }

  // Submit Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const num = parseInt(formData.number, 10)
    if (isNaN(num)) {
      setErrorMessage("유효한 카드 번호를 입력하세요.")
      return
    }

    if (!formData.name.trim()) {
      setErrorMessage("카드명을 입력하세요.")
      return
    }

    if (!formData.code.trim()) {
      setErrorMessage("카드 코드를 입력하세요.")
      return
    }

    const parsedTraits = formData.traits
      .split(/[,.]/)
      .map((t) => t.trim())
      .filter(Boolean)

    const parsedTraitsEn = formData.traitsEn
      .split(/[,.]/)
      .map((t) => t.trim())
      .filter(Boolean)

    const finalTraitsEn =
      parsedTraitsEn.length > 0
        ? parsedTraitsEn
        : parsedTraits.length > 0
          ? parsedTraits.map((t) => translateTrait(t, "en"))
          : undefined

    const cardPayload: Card = {
      code: formData.code.trim(),
      number: num,
      name: formData.name.trim(),
      nameEn: formData.nameEn.trim() || undefined,
      type: formData.type.trim(),
      set: formData.set.trim(),
      sphere:
        formData.sphere && formData.sphere !== "none"
          ? formData.sphere
          : undefined,
      traits: parsedTraits.length > 0 ? parsedTraits : undefined,
      traitsEn: finalTraitsEn,
      unique: formData.unique ? true : undefined,
      cost: formData.cost !== "" ? parseInt(formData.cost, 10) : undefined,
      threat:
        formData.threat !== "" ? parseInt(formData.threat, 10) : undefined,
      willpower:
        formData.willpower !== ""
          ? parseInt(formData.willpower, 10)
          : undefined,
      attack:
        formData.attack !== "" ? parseInt(formData.attack, 10) : undefined,
      defense:
        formData.defense !== "" ? parseInt(formData.defense, 10) : undefined,
      hitpoints:
        formData.hitpoints !== ""
          ? parseInt(formData.hitpoints, 10)
          : undefined,
    }

    startTransition(async () => {
      const res = await saveCardAction(
        cardPayload,
        editingCard ? editingCard.code : undefined
      )
      if (res.success) {
        setDialogOpen(false)
        router.refresh()
      } else {
        setErrorMessage(res.error || "저장에 실패했습니다.")
      }
    })
  }

  // Submit Delete
  const handleDeleteConfirm = () => {
    if (!deletingCard) return

    startTransition(async () => {
      const res = await deleteCardAction(deletingCard.code, deletingCard.set)
      if (res.success) {
        setDeletingCard(null)
        router.refresh()
      } else {
        alert(res.error || "삭제에 실패했습니다.")
      }
    })
  }

  // Filter cards
  const filteredCards = initialCards.filter((card) => {
    if (
      setFilter !== "all" &&
      card.set.toLowerCase() !== setFilter.toLowerCase()
    ) {
      return false
    }
    if (sphereFilter !== "all") {
      if (sphereFilter === "none" && card.sphere) return false
      if (sphereFilter !== "none" && card.sphere !== sphereFilter) return false
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      const matchName = card.name.toLowerCase().includes(q)
      const matchNameEn = card.nameEn?.toLowerCase().includes(q)
      const matchCode = card.code.toLowerCase().includes(q)
      const matchType = card.type.toLowerCase().includes(q)
      const matchTraits = card.traits?.some((t) => {
        const ko = t.toLowerCase()
        const en = translateTrait(t, "en").toLowerCase()
        return ko.includes(q) || en.includes(q)
      })
      const matchTraitsEn = card.traitsEn?.some((t) => {
        const en = t.toLowerCase()
        const ko = translateTrait(t, "ko").toLowerCase()
        return en.includes(q) || ko.includes(q)
      })
      if (
        !matchName &&
        !matchNameEn &&
        !matchCode &&
        !matchType &&
        !matchTraits &&
        !matchTraitsEn
      )
        return false
    }
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header & New Card button */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">카드 관리</h1>
          <p className="text-sm text-muted-foreground">
            카드 데이터를 직접 추가, 수정, 삭제할 수 있습니다. 변경 즉시 전체
            사이트에 반영됩니다.
          </p>
        </div>
        <Button onClick={handleOpenNewCard}>
          <PlusIcon data-icon="inline-start" />새 카드 추가
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/20 p-3">
        <div className="relative min-w-[200px] flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="카드명, 코드, 타입, 특성 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="w-40">
          <Select
            value={setFilter}
            onValueChange={(val) => val && setSetFilter(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="세트 필터">
                {(val: string | null) => {
                  if (val === "all" || !val) return "전체 세트"
                  const s = sets.find(
                    (set) => set.code.toLowerCase() === val.toLowerCase()
                  )
                  return s ? `${s.name} (${s.code})` : val
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">전체 세트</SelectItem>
                {sets.map((set) => (
                  <SelectItem key={set.code} value={set.code}>
                    {set.name} ({set.code})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-36">
          <Select
            value={sphereFilter}
            onValueChange={(val) => val && setSphereFilter(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="계열 필터">
                {(val: string | null) => {
                  if (val === "all" || !val) return "전체 계열"
                  if (val === "none") return "계열 없음"
                  return val
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">전체 계열</SelectItem>
                {SPHERES.map((sphere) => (
                  <SelectItem key={sphere} value={sphere}>
                    {sphere}
                  </SelectItem>
                ))}
                <SelectItem value="none">계열 없음</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {(search || setFilter !== "all" || sphereFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("")
              setSetFilter("all")
              setSphereFilter("all")
            }}
          >
            필터 초기화
          </Button>
        )}

        <div className="ml-auto text-xs text-muted-foreground">
          총 {initialCards.length}장 중 {filteredCards.length}장 표시
        </div>
      </div>

      {/* Cards Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">코드</TableHead>
              <TableHead className="w-16">세트</TableHead>
              <TableHead className="w-14">번호</TableHead>
              <TableHead>카드명</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>계열</TableHead>
              <TableHead className="text-right">비용</TableHead>
              <TableHead className="text-right">위협</TableHead>
              <TableHead className="text-right">
                <span className="inline-flex items-center gap-1">
                  <SunIcon className="size-3.5" aria-hidden="true" />
                  의지
                </span>
              </TableHead>
              <TableHead className="text-right">
                <span className="inline-flex items-center gap-1">
                  <SwordsIcon className="size-3.5" aria-hidden="true" />
                  공격
                </span>
              </TableHead>
              <TableHead className="text-right">
                <span className="inline-flex items-center gap-1">
                  <ShieldIcon className="size-3.5" aria-hidden="true" />
                  방어
                </span>
              </TableHead>
              <TableHead className="text-right">
                <span className="inline-flex items-center gap-1">
                  <HeartIcon className="size-3.5" aria-hidden="true" />
                  체력
                </span>
              </TableHead>
              <TableHead className="w-24 text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCards.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={13}
                  className="h-32 text-center text-muted-foreground"
                >
                  검색 조건에 맞는 카드가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredCards.map((card) => (
                <TableRow key={card.code}>
                  <TableCell className="font-mono text-xs font-semibold">
                    {card.code}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {card.set}
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {card.number}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium">
                      {card.unique && <UniqueMark className="text-xs" />}
                      <span>{card.name}</span>
                    </div>
                    {card.nameEn && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {card.unique && (
                          <UniqueMark className="text-[10px] text-muted-foreground/70" />
                        )}
                        <span>{card.nameEn}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {card.type}
                  </TableCell>
                  <TableCell>
                    {card.sphere ? (
                      <Badge
                        variant="outline"
                        className={sphereStyles[card.sphere]}
                      >
                        {card.sphere}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {card.cost ?? "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {card.threat ?? "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {card.willpower ?? "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {card.attack ?? "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {card.defense ?? "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {card.hitpoints ?? "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`${card.name} 수정`}
                        onClick={() => handleOpenEditCard(card)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`${card.name} 삭제`}
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingCard(card)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>
                {editingCard
                  ? `카드 수정: ${editingCard.name}`
                  : "새 카드 추가"}
              </DialogTitle>
              <DialogDescription>
                카드 정보와 스탯을 입력해 주세요. 저장 시 파일에 바로
                반영됩니다.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-col gap-4">
              {errorMessage && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              {/* Basic Fields */}
              <FieldGroup>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="card-set">세트</FieldLabel>
                    <Select
                      value={formData.set}
                      onValueChange={handleSetChange}
                    >
                      <SelectTrigger id="card-set" className="w-full">
                        <SelectValue placeholder="세트 선택">
                          {(val: string | null) => {
                            const s = sets.find((set) => set.code === val)
                            return s ? `${s.name} (${s.code})` : val || "선택"
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sets.map((s) => (
                            <SelectItem key={s.code} value={s.code}>
                              {s.name} ({s.code})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="card-number">카드 번호</FieldLabel>
                    <Input
                      id="card-number"
                      type="number"
                      min={1}
                      value={formData.number}
                      onChange={(e) => handleNumberChange(e.target.value)}
                      placeholder="1"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="card-code">카드 코드</FieldLabel>
                    <Input
                      id="card-code"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, code: e.target.value }))
                      }
                      placeholder="RCS-001"
                      required
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="card-name">카드명 (한글)</FieldLabel>
                    <Input
                      id="card-name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="예: 아라곤"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="card-name-en">
                      영문 카드명 (선택)
                    </FieldLabel>
                    <Input
                      id="card-name-en"
                      value={formData.nameEn}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, nameEn: e.target.value }))
                      }
                      placeholder="예: Aragorn"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="card-type">타입</FieldLabel>
                    <Select
                      value={formData.type}
                      onValueChange={(val) =>
                        val && setFormData((p) => ({ ...p, type: val }))
                      }
                    >
                      <SelectTrigger id="card-type" className="w-full">
                        <SelectValue placeholder="타입 선택">
                          {(val: string | null) => val || "선택"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {CARD_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="card-sphere">계열 (Sphere)</FieldLabel>
                    <Select
                      value={formData.sphere}
                      onValueChange={(val) =>
                        val && setFormData((p) => ({ ...p, sphere: val }))
                      }
                    >
                      <SelectTrigger id="card-sphere" className="w-full">
                        <SelectValue placeholder="계열 선택">
                          {(val: string | null) => {
                            if (!val || val === "none") return "계열 없음"
                            return val
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="none">계열 없음</SelectItem>
                          {SPHERES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2">
                  <input
                    type="checkbox"
                    id="card-unique"
                    checked={formData.unique}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, unique: e.target.checked }))
                    }
                    className="size-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="card-unique"
                    className="flex cursor-pointer items-center gap-1.5 text-sm font-medium"
                  >
                    <UniqueMark className="text-sm" />
                    <span>고유 카드 (Unique)</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      - 이름 앞에 ✦ 기호가 표시됩니다
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="card-traits">
                      특성 (한글, 쉼표 구분)
                    </FieldLabel>
                    <Input
                      id="card-traits"
                      value={formData.traits}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, traits: e.target.value }))
                      }
                      placeholder="예: 두네다인, 귀족, 순찰자"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="card-traits-en">
                      영문 특성 (선택, 쉼표 구분)
                    </FieldLabel>
                    <Input
                      id="card-traits-en"
                      value={formData.traitsEn}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, traitsEn: e.target.value }))
                      }
                      placeholder="예: Dúnedain, Noble, Ranger"
                    />
                  </Field>
                </div>

                {/* Stats Grid */}
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="mb-2 text-xs font-medium text-muted-foreground">
                    스탯 정보 (해당하는 항목만 입력)
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
                    <Field>
                      <FieldLabel htmlFor="card-cost" className="text-xs">
                        비용
                      </FieldLabel>
                      <Input
                        id="card-cost"
                        type="number"
                        min={0}
                        value={formData.cost}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, cost: e.target.value }))
                        }
                        placeholder="-"
                        className="h-8"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="card-threat" className="text-xs">
                        위협
                      </FieldLabel>
                      <Input
                        id="card-threat"
                        type="number"
                        min={0}
                        value={formData.threat}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, threat: e.target.value }))
                        }
                        placeholder="-"
                        className="h-8"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="card-willpower" className="text-xs">
                        의지력
                      </FieldLabel>
                      <Input
                        id="card-willpower"
                        type="number"
                        min={0}
                        value={formData.willpower}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            willpower: e.target.value,
                          }))
                        }
                        placeholder="-"
                        className="h-8"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="card-attack" className="text-xs">
                        공격력
                      </FieldLabel>
                      <Input
                        id="card-attack"
                        type="number"
                        min={0}
                        value={formData.attack}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, attack: e.target.value }))
                        }
                        placeholder="-"
                        className="h-8"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="card-defense" className="text-xs">
                        방어력
                      </FieldLabel>
                      <Input
                        id="card-defense"
                        type="number"
                        min={0}
                        value={formData.defense}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            defense: e.target.value,
                          }))
                        }
                        placeholder="-"
                        className="h-8"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="card-hitpoints" className="text-xs">
                        체력
                      </FieldLabel>
                      <Input
                        id="card-hitpoints"
                        type="number"
                        min={0}
                        value={formData.hitpoints}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            hitpoints: e.target.value,
                          }))
                        }
                        placeholder="-"
                        className="h-8"
                      />
                    </Field>
                  </div>
                </div>
              </FieldGroup>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isPending}
              >
                취소
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deletingCard)}
        onOpenChange={(open) => !open && setDeletingCard(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>카드 삭제 확인</DialogTitle>
            <DialogDescription>
              정말로 <strong>{deletingCard?.name}</strong> ({deletingCard?.code}
              ) 카드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeletingCard(null)}
              disabled={isPending}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isPending}
            >
              {isPending ? "삭제 중..." : "삭제하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
