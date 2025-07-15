'use client'
import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { scrapeAndSummarise } from '@/actions/summarise'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import Spinner from '@/components/ui/spinner'

export default function Home() {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [summaryUrdu, setSummaryUrdu] = useState('')
  const [loading, startTransition] = useTransition()

  const { theme, setTheme } = useTheme()

  const handleSummarise = () => {
    startTransition(async () => {
      const { summary, translated } = await scrapeAndSummarise(url)
      setSummary(summary)
      setSummaryUrdu(translated)
    })
  }

  return (
    <main
  className="min-h-screen flex items-center justify-center p-6 text-foreground transition-colors bg-cover bg-center"
  style={{ backgroundImage: 'url("/bg.jpg")' }}
>
    
      <div className="max-w-2xl w-full space-y-6">

        <div className="flex justify-between items-center">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 text-transparent bg-clip-text drop-shadow-md">
  Shortr
</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </div>

        <p className="text-muted-foreground">
          Paste any blog URL and get a brief summary.
        </p>

        <div className="flex items-center space-x-2">
          <Input
            className="flex-1"
            placeholder="Enter blog URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
  className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-lg hover:opacity-90 transition"
  onClick={handleSummarise}
  disabled={loading}
>
  {loading ? (
    <div className="flex items-center space-x-2">
      <Spinner />
      <span>Summarising...</span>
    </div>
  ) : (
    'Summarise'
  )}
</Button>
        </div>

        {summary && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <h2 className="font-semibold text-lg"> Summary (English)</h2>
                <Textarea className="text-sm" value={summary} readOnly />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <h2 className="font-semibold text-lg"> Summary (Urdu)</h2>
                <Textarea dir="rtl" className="text-right text-sm" value={summaryUrdu} readOnly />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
