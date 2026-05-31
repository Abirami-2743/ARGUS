import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'ARGUS — AI Agent Safety Monitor',
  description: 'Real-time AI safety monitoring for multi-agent environments.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}