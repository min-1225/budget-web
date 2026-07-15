# 소스 구조

이 문서는 `budget-web` 저장소의 주요 파일 역할과 라이브러리 API/직접 구현 로직을 구분해서 정리한 문서입니다.

## 폴더 구조

```text
app/
├── page.js
├── actions.js
├── layout.js
└── login/
    ├── page.js
    └── actions.js

components/
├── AnnualSavingCard.jsx
├── CategoryChart.jsx
├── EntryForm.jsx
├── MonthNav.jsx
├── SeedButton.jsx
├── TransactionList.jsx
└── WarningCards.jsx

lib/
├── analysis.js
├── categories.js
└── supabase/
    ├── client.js
    └── server.js
```

## app

- `app/page.js`: 로그인한 사용자의 월별 수입/지출 데이터를 조회하고 대시보드를 렌더링하는 메인 페이지입니다.
- `app/actions.js`: 지출 추가, 데모 데이터 삽입, 지출 삭제를 처리하는 Next.js Server Actions 파일입니다.
- `app/layout.js`: 앱 전체 HTML 구조와 전역 스타일을 적용하는 루트 레이아웃입니다.
- `app/login/page.js`: 이메일/비밀번호 로그인과 회원가입 UI를 제공하는 클라이언트 페이지입니다.
- `app/login/actions.js`: Supabase Auth를 이용해 로그인, 회원가입, 로그아웃을 처리하는 Server Actions 파일입니다.

## components

- `EntryForm.jsx`: 수입/지출 타입, 금액, 카테고리, 날짜, 메모를 입력받아 `addEntry` 액션을 호출하는 폼입니다.
- `WarningCards.jsx`: 과소비 분석 결과를 카드 형태로 보여주는 컴포넌트입니다.
- `AnnualSavingCard.jsx`: 과소비를 줄였을 때 연간 절약 가능한 금액을 요약해서 보여주는 컴포넌트입니다.
- `SeedButton.jsx`: 60일치 데모 데이터를 생성하는 버튼 컴포넌트입니다.
- `MonthNav.jsx`: 월별 대시보드를 이동하기 위한 이전/다음 월 내비게이션입니다.
- `CategoryChart.jsx`: 카테고리별 지출 합계를 막대 그래프로 보여주는 컴포넌트입니다.
- `TransactionList.jsx`: 선택한 월의 거래 내역을 리스트로 보여주고 삭제 기능을 제공합니다.

## lib

- `lib/categories.js`: 지출 카테고리 목록과 카테고리별 이모지 값을 정의합니다.
- `lib/analysis.js`: 평균, 표준편차, 기준치 계산을 통해 과소비 여부를 판단하는 직접 구현 분석 로직입니다.
- `lib/supabase/client.js`: 브라우저 클라이언트 컴포넌트에서 사용하는 Supabase 클라이언트를 생성합니다.
- `lib/supabase/server.js`: 서버 컴포넌트와 Server Actions에서 쿠키 기반 Supabase 클라이언트를 생성합니다.

## 프로젝트에서 직접 만든 함수

- `buildBaselines(rows)`: 직전 기간 지출 데이터를 카테고리/월별로 묶고 평균, 표준편차, 경고 기준치를 계산합니다.
- `detectOverspending(thisMonthTotals, baselines)`: 이번 달 지출 합계가 기준치를 넘는 카테고리를 찾아 경고 배열을 만듭니다.
- `calcThisMonthTotals(rows)`: 거래 배열에서 이번 달 지출만 골라 카테고리별 합계를 계산합니다.
- `addEntry(formData)`: 사용자가 입력한 수입/지출 데이터를 Supabase `expenses` 테이블에 저장합니다.
- `seedData()`: 데모 시연용 60일치 mock 데이터를 현재 사용자 계정에 삽입합니다.
- `deleteEntry(id)`: 현재 사용자 소유의 거래 내역을 삭제합니다.

## 사용한 주요 라이브러리 API

- `useState`: React에 있는 Hook으로, 폼 입력값과 pending/error 같은 UI 상태를 관리합니다.
- `redirect`: Next.js `next/navigation`에 있는 함수로, 로그인 여부에 따라 페이지를 이동시킵니다.
- `revalidatePath`: Next.js `next/cache`에 있는 함수로, Server Action 이후 페이지 데이터를 다시 불러오게 합니다.
- `createBrowserClient`: `@supabase/ssr`에 있는 함수로, 브라우저에서 Supabase 클라이언트를 생성합니다.
- `createServerClient`: `@supabase/ssr`에 있는 함수로, 서버에서 쿠키 기반 Supabase 클라이언트를 생성합니다.
- `supabase.auth.getUser`: Supabase Auth의 현재 로그인 사용자 조회 메서드입니다.
- `supabase.auth.signInWithPassword`: Supabase Auth의 이메일/비밀번호 로그인 메서드입니다.
- `supabase.auth.signUp`: Supabase Auth의 회원가입 메서드입니다.
- `supabase.auth.signOut`: Supabase Auth의 로그아웃 메서드입니다.
- `supabase.from(...).select/insert/delete`: Supabase 데이터베이스 테이블을 조회, 삽입, 삭제하는 쿼리 빌더 메서드입니다.

