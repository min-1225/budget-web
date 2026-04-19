import './globals.css'

export const metadata = {
  title: '가계부',
  description: '월별 소비 패턴 분석 가계부',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
