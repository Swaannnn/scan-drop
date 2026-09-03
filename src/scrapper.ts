import { chromium } from 'playwright'

async function testerScraping() {
    const browser = await chromium.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto('https://mangamoins.com/manga/one_piece')
    await page.waitForLoadState('networkidle')

    const lastChapter = await page.$eval('a[href*="/scan/OP1"]', (el) => (el as HTMLAnchorElement).href)

    console.log(lastChapter)

    await browser.close()
}

testerScraping().catch(console.error)
