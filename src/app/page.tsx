'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { scrapeAndSummarise } from '@/actions/summarise'

export default function Home() {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [summaryUrdu, setSummaryUrdu] = useState('')
  const [loading, startTransition] = useTransition()

  const handleSummarise = () => {
    startTransition(async () => {
      const { summary, translated } = await scrapeAndSummarise(url)
      setSummary(summary)
      setSummaryUrdu(translated)
    })
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">📝 Blog Summariser</h1>

      <Input
        placeholder="Enter blog URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <Button onClick={handleSummarise} disabled={loading}>
        {loading ? 'Summarising...' : 'Summarise Blog'}
      </Button>

      {summary && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="font-semibold">📄 Summary (English)</h2>
            <Textarea value={summary} readOnly />

            <h2 className="font-semibold mt-4">🌐 Summary (Urdu)</h2>
            <Textarea value={summaryUrdu} readOnly />
          </CardContent>
        </Card>
      )}
    </main>
  )
}
