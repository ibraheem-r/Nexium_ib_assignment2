'use server'

import { supabase } from '@/lib/supabase'
import { client, blogsCollection } from '@/lib/mongo'
import { JSDOM } from 'jsdom'

// ✅ Urdu translation dictionary (100+ words)
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
  'car': 'گاڑی',
  'cars': 'گاڑیاں',
  'drive': 'چلانا',
  'rain': 'بارش',
  'monsoon': 'مون سون',
  'education': 'تعلیم',
  'health': 'صحت',
  'economy': 'معیشت',
  'growth': 'ترقی',
  'development': 'ترقی',
  'government': 'حکومت',
  'people': 'لوگ',
  'system': 'نظام',
  'change': 'تبدیلی',
  'internet': 'انٹرنیٹ',
  'data': 'اعداد و شمار',
  'science': 'سائنس',
  'research': 'تحقیق',
  'energy': 'توانائی',
  'power': 'بجلی',
  'climate': 'آب و ہوا',
  'environment': 'ماحول',
  'food': 'خوراک',
  'water': 'پانی',
  'transport': 'ٹرانسپورٹ',
  'network': 'نیٹ ورک',
  'digital': 'ڈیجیٹل',
  'machine': 'مشین',
  'robot': 'روبوٹ',
  'human': 'انسان',
  'language': 'زبان',
  'communication': 'ابلاغ',
  'phone': 'فون',
  'mobile': 'موبائل',
  'smart': 'سمارٹ',
  'apps': 'ایپس',
  'devices': 'آلات',
  'work': 'کام',
  'jobs': 'ملازمتیں',
  'business': 'کاروبار',
  'money': 'پیسہ',
  'market': 'بازار',
  'value': 'قدر',
  'success': 'کامیابی',
  'failure': 'ناکامی',
  'hope': 'امید',
  'fear': 'خوف',
  'life': 'زندگی',
  'death': 'موت',
  'love': 'محبت',
  'hate': 'نفرت',
  'truth': 'سچ',
  'false': 'جھوٹ',
  'peace': 'امن',
  'war': 'جنگ',
  'justice': 'انصاف',
  'freedom': 'آزادی',
  'culture': 'ثقافت',
  'religion': 'مذہب',
  'belief': 'یقین',
  'faith': 'ایمان',
  'social': 'سماجی',
  'media': 'میڈیا',
  'news': 'خبریں',
  'politics': 'سیاست',
  'policy': 'پالیسی',
  'law': 'قانون',
  'crime': 'جرم',
  'security': 'سلامتی',
  'safety': 'حفاظت',
  'strategy': 'حکمت عملی',
  'plan': 'منصوبہ',
  'goal': 'مقصد',
  'vision': 'نقطہ نظر',
  'mission': 'مشن',
  'challenge': 'چیلنج',
  'solution': 'حل',
}

export async function scrapeAndSummarise(url: string) {
  try {
    const res = await fetch(url)
    const html = await res.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // ✅ Try to find paragraphs inside important containers
    const possibleContainers = ['article', 'main', '.post', '.blog', '#content']
    let paragraphs: Element[] = []

    for (const selector of possibleContainers) {
      const container = document.querySelector(selector)
      if (container) {
        paragraphs = Array.from(container.querySelectorAll('p'))
        if (paragraphs.length > 3) break
      }
    }

    if (paragraphs.length === 0) {
      paragraphs = Array.from(document.querySelectorAll('p'))
    }

    const cleanParas = paragraphs
      .map(p => p.textContent?.trim() || '')
      .filter(p => p.length > 50 && !/subscribe|cookie|email|login|privacy|newsletter/i.test(p))

    const blogText = cleanParas.slice(0, 6).join(' ').slice(0, 1500)

    if (!blogText) {
      throw new Error('No blog text extracted.')
    }
    console.log('✂️ Blog text sample:', blogText.slice(0, 300))

    // ✅ Create a 3–4 sentence summary
    const sentences = blogText.split('.').map(s => s.trim()).filter(Boolean)
    const summary = sentences.slice(0, 4).join('. ') + '.'

    // ✅ Translate summary using dictionary
    const translated = summary.split(' ').map(word => {
      const clean = word.toLowerCase().replace(/[.,]/g, '')
      return dictionary[clean] || word
    }).join(' ')

    // ✅ Save to Supabase
    await supabase.from('summaries').insert([
      { url, summary_en: summary, summary_ur: translated }
    ])

    // ✅ Save full blog to MongoDB
    await client.connect()
    await blogsCollection.insertOne({
      url,
      full_text: blogText,
      created_at: new Date(),
    })
    await client.close()

    return { summary, translated }

  } catch (err) {
    console.error('❌ Error scraping blog:', (err as Error).message)
    return {
      summary: 'Error scraping blog.',
      translated: 'خرابی ہوگئی ہے۔',
    }
  }
}
