import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(req: Request) {
  const { url } = await req.json()

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    })

    const $ = cheerio.load(data)

    
    const paragraphs = $('p')
      .map((_, el) => $(el).text())
      .get()
      .join(' ')

    const text = paragraphs.trim().slice(0, 2000) // limit length

    return NextResponse.json({ success: true, text })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
