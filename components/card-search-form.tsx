"use client"

import { useState } from "react"
import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export function CardSearchForm() {
  const [query, setQuery] = useState("")
  const isEmpty = query.trim().length === 0

  return (
    <form
      role="search"
      className="w-full max-w-xl"
      onSubmit={(event) => event.preventDefault()}
    >
      <InputGroup className="h-12 rounded-xl">
        <InputGroupInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="카드 이름, 종족, 진영으로 검색..."
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="submit"
            variant="default"
            size="icon-sm"
            aria-label="검색"
            disabled={isEmpty}
          >
            <SearchIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}