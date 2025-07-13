'use server'

import { supabase } from '@/lib/supabase'
import { client, blogsCollection } from '@/lib/mongo'
import { JSDOM } from 'jsdom'

const dictionary: Record<string, string> = {
  'technology': 'ٹیکنالوجی',
  'innovation': 'جدت',
  'artificial': 'مصنوعی',
  'intelligence': 'ذہانت',
  'world': 'دنیا',
  'companies': 'کمپنیاں',
  'productivity': 'پیداواری صلاحیت',
  'ai': 'اے آئی',
  'tools': 'اوزار',
  'future': 'مستقبل',
}

export async function scrapeAndSummarise(url: string) {
  try {
    const res = await fetch(url)
    const html = await res.text()

    const dom = new JSDOM(html)
    const paragraphs = dom.window.document.querySelectorAll('p')
    const blogText = Array.from(paragraphs)
      .map(p => p.textContent?.trim())
      .filter(Boolean)
      .join(' ')
      .slice(0, 1000)

    const summary = blogText.split('.').slice(0, 2).join('.') + '.'

    const translated = summary.split(' ').map(word => {
      const clean = word.toLowerCase().replace(/[.,]/g, '')
      return dictionary[clean] || word
    }).join(' ')

    await supabase.from('summaries').insert([
      { url, summary_en: summary, summary_ur: translated }
    ])

    await client.connect()
    await blogsCollection.insertOne({
      url,
      full_text: blogText,
      created_at: new Date(),
    })
    await client.close()

    return { summary, translated }
  } catch (err) {
    console.error('Error:', (err as Error).message)
    return { summary: 'Error scraping blog.', translated: 'خرابی ہوگئی ہے۔' }
  }
}
