import { chromium } from 'playwright'
import type { Manga } from './types.js'

async function getLastChapterUrl(manga: Manga): Promise<string> {
    const browser = await chromium.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto(`https://mangamoins.com/manga/${manga.name}`)
    await page.waitForLoadState('networkidle')

    const lastChapter = await page.$eval('#cta-last-container a', (el) => (el as HTMLAnchorElement).href)

    await browser.close()

    return lastChapter
}

export { getLastChapterUrl }
