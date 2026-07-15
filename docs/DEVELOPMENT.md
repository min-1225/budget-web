# 개발/배포 가이드

이 문서는 `budget-web` 프로젝트를 로컬에서 실행하고 Supabase/Vercel에 연결하는 순서를 정리한 문서입니다.

## 1. 환경 준비

Node.js v18 이상이 필요합니다.

```bash
node --version
npm --version
```

Supabase 프로젝트를 생성한 뒤 Project URL과 anon key를 준비합니다.

## 2. 패키지 설치

```bash
npm install
```

현재 프로젝트의 핵심 패키지는 다음과 같습니다.

- `next`: Next.js App Router 기반 웹앱 프레임워크입니다.
- `react`, `react-dom`: UI 컴포넌트 렌더링에 사용하는 React 라이브러리입니다.
- `@supabase/supabase-js`: Supabase Auth/DB와 통신하는 JavaScript 클라이언트입니다.
- `@supabase/ssr`: Next.js 서버/브라우저 환경에서 Supabase 세션 쿠키를 다루는 라이브러리입니다.
- `tailwindcss`: 유틸리티 클래스 기반 CSS 스타일링 도구입니다.

## 3. 환경 변수

루트에 `.env.local` 파일을 만들고 아래 값을 채웁니다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

실제 값은 GitHub에 커밋하지 않습니다.

## 4. Supabase 스키마 적용

Supabase Dashboard > SQL Editor에서 [SUPABASE_SCHEMA.sql](./SUPABASE_SCHEMA.sql)을 실행합니다.

이 스키마는 `expenses` 테이블을 만들고 사용자별 Row Level Security 정책을 설정합니다.

## 5. 로컬 실행

```bash
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3000
```

## 6. 동작 확인 순서

1. `/login`에서 회원가입합니다.
2. Supabase 이메일 인증 설정에 따라 로그인 가능 여부를 확인합니다.
3. 대시보드에서 수입 또는 지출을 입력합니다.
4. "데모 데이터 넣기" 버튼으로 60일치 mock 데이터를 생성합니다.
5. 월 이동, 카테고리 차트, 과소비 경고 카드가 표시되는지 확인합니다.

## 7. 배포

로컬 빌드를 먼저 확인합니다.

```bash
npm run build
```

Vercel에 배포한 뒤 Project Settings > Environment Variables에 아래 값을 등록합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Supabase Authentication > URL Configuration에서 배포 URL을 등록합니다.

```text
Site URL: https://your-project.vercel.app
Redirect URLs: https://your-project.vercel.app/**
```

## 8. 트러블슈팅

### RLS 오류 또는 데이터가 안 보일 때

Supabase SQL Editor에서 RLS 정책 4개가 모두 생성되어 있는지 확인합니다.

- own select
- own insert
- own update
- own delete

### 환경 변수가 undefined일 때

Next.js에서 브라우저에 노출되는 환경 변수는 `NEXT_PUBLIC_` 접두사가 필요합니다.

### 로그인 후 리다이렉트가 반복될 때

`proxy.js`의 matcher가 `_next/static`, `_next/image`, `favicon.ico`, 이미지 파일을 제외하는지 확인합니다.

### 분석 카드가 안 보일 때

직전 기간 데이터가 없으면 기준선을 계산할 수 없습니다. 데모 데이터 생성 후 새로고침합니다.

### Vercel에서는 깨지는데 로컬에서는 될 때

- GitHub에 최신 코드가 push되어 있는지 확인합니다.
- Vercel이 올바른 브랜치를 보고 있는지 확인합니다.
- Vercel 환경 변수가 로컬 `.env.local`과 같은 이름인지 확인합니다.
- 파일명 대소문자가 정확한지 확인합니다.

