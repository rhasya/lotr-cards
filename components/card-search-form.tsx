"use client"

import { useState } from "react"
import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useLanguage } from "@/components/language-provider"
import { UI_I18N } from "@/lib/i18n"

export function CardSearchForm() {
  const { locale } = useLanguage()
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
          placeholder={UI_I18N.home.searchPlaceholder[locale]}
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