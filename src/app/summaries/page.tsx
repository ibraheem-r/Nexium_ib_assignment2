import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'


export default async function SummariesPage() {
    
    const supabase = createServerClient()

  const { data: summaries, error } = await supabase
    .from('summaries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="text-red-500">Error loading summaries: {error.message}</p>
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">📚 Saved Summaries</h1>

      {summaries?.length === 0 && <p>No summaries found.</p>}

      {summaries?.map((s) => (
        <Card key={s.id}>
          <CardContent className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground">🔗 {s.url}</p>
            <Textarea readOnly value={s.summary_en} />
            <Textarea readOnly value={s.summary_ur} />
          </CardContent>
        </Card>
      ))}
    </main>
  )
}
