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
    if (!url) return alert('Please enter a blog URL.')
    startTransition(async () => {
      const { summary, translated } = await scrapeAndSummarise(url)
      setSummary(summary)
      setSummaryUrdu(translated)
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">📝 Blog Summariser</h1>
        <p className="text-center text-gray-500">Enter a blog URL to summarise and translate.</p>

        <div className="flex gap-2">
          <Input
            placeholder="Paste blog URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSummarise} disabled={loading}>
            {loading ? 'Summarising...' : 'Summarise'}
          </Button>
        </div>

        {summary && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h2 className="text-lg font-semibold">📄 Summary (English)</h2>
                <Textarea value={summary} readOnly className="h-32" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">🌐 Summary (Urdu)</h2>
                <Textarea value={summaryUrdu} readOnly className="h-32" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
