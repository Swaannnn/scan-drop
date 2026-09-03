import 'dotenv/config'
import { client, getLastChapterSend, sendMessage } from './discorD.js'
import { getLastChapterUrl } from './scrapper.js'
import { MANGA } from './constants.js'

const TOKEN = process.env.DISCORD_TOKEN
const CHANNEL_ID = process.env.CHANNEL_ID
const USER_ID = process.env.USER_ID

if (!TOKEN || !CHANNEL_ID || !USER_ID) {
    process.exit(1)
}

const INTERVALLE_MS = 2 * 10 * 1000 // 10 minutes

async function searchNewChapter() {
    console.log(`[${new Date().toLocaleString()}] search new chapter...`)

    const newChapterLink = await getLastChapterUrl(MANGA.OP)
    if (!newChapterLink) return

    const savedChapterLink = await getLastChapterSend(CHANNEL_ID!)

    if (newChapterLink !== savedChapterLink) {
        console.log(`[${new Date().toLocaleString()}] New chapter available, sending notification...`)
        await sendMessage(CHANNEL_ID!, USER_ID!, newChapterLink)
    } else {
        console.log(`[${new Date().toLocaleString()}] No new chapter available.`)
    }
}

client.once('clientReady', () => {
    console.log(`[${new Date().toLocaleString()}] ScanDrop logged as ${client.user?.tag}`)

    searchNewChapter()
    setInterval(searchNewChapter, INTERVALLE_MS)
})

client.login(TOKEN)
