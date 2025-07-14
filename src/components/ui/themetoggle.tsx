'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="ml-auto"
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </Button>
  )
}
