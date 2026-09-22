<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

이 프로젝트의 패키지 관리자는 pnpm이다.

컴포넌트 사용시에는 무조건 shadcn컴포넌트를 우선적으로 검토한 후, 커스텀 컴포넌트를 생성한다.

너무 깊게 생각하지 않아도 돼

## 프로젝트 구조

```text
lotr-cards/
├── app/                        # Next.js App Router
│   ├── admin/                  # 카드 데이터 관리자 페이지
│   │   ├── actions.ts          # 카드 CRUD Server Actions
│   │   └── page.tsx            # 관리자 대시보드
│   ├── sets/                   # 세트 페이지
│   │   ├── [code]/page.tsx     # 세트별 카드 목록 페이지
│   │   └── page.tsx            # 전체 세트 목록 페이지
│   ├── globals.css             # 전역 스타일 (Tailwind CSS)
│   ├── layout.tsx              # 루트 레이아웃 (내비게이션 바, 테마 설정)
│   └── page.tsx                # 메인 페이지 (카드 검색 및 필터링)
├── components/                 # React 컴포넌트
│   ├── ui/                     # shadcn UI 컴포넌트
│   ├── admin-card-manager.tsx  # 관리자 카드 관리 UI
│   ├── card-search-form.tsx    # 카드 검색/필터 폼 UI
│   ├── ring-mark.tsx           # 절대반지 테마 심볼 UI
│   ├── site-navbar.tsx         # 사이트 상단 내비게이션 바
│   └── theme-provider.tsx      # 다크/라이트 테마 프로바이더
├── data/                       # 데이터 파일
│   ├── cards.jsonl             # 카드 데이터셋 (JSON Lines)
│   └── sets.json               # 세트 메타데이터
├── lib/                        # 유틸리티 및 헬퍼
│   ├── sets.ts                 # 세트 조회 및 파싱 헬퍼
│   └── utils.ts                # 스타일/클래스 유틸 (cn 등)
├── public/                     # 정적 자산
├── components.json             # shadcn UI 설정
├── next.config.ts              # Next.js 설정 파일
├── package.json                # 패키지 의존성 및 스크립트 (pnpm)
└── tsconfig.json               # TypeScript 설정 파일
```

