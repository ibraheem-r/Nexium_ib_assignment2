import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export const runtime = 'nodejs'
export async function POST(req: Request) {
  const { url } = await req.json()
  console.log('Received URL:', url)

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'text/html,application/xhtml+xml'
      },
    })

    console.log('Fetched HTML length:', data.length)

    const $ = cheerio.load(data)

    const paragraphs = $('p')
      .map((_, el) => $(el).text())
      .get()
      .join(' ')

    const text = paragraphs.trim().slice(0, 2000)

    return NextResponse.json({ success: true, text })
  } catch (err) {
    const error = err as Error
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
  
}

