import 'dotenv/config'
import { client, getLastChapterSend, getUsersMessageReactions, sendMessage } from './discord.js'
import { getLastChapterUrl } from './scrapper.js'
import { MANGA } from './constants.js'

const TOKEN = process.env.DISCORD_TOKEN
const CHAPTER_CHANNEL_ID = process.env.CHAPTER_CHANNEL_ID
const REACTIONS_CHANNEL_ID = process.env.REACTIONS_CHANNEL_ID
const REACTION_MESSAGE_ID = process.env.REACTION_MESSAGE_ID

if (!TOKEN || !CHAPTER_CHANNEL_ID || !REACTIONS_CHANNEL_ID || !REACTION_MESSAGE_ID) {
    process.exit(1)
}

const INTERVALLE_MS = 60 * 10 * 1000 // 10 minutes

async function searchNewChapter() {
    console.log(`[${new Date().toLocaleString()}] search new chapter...`)

    const newChapterLink = await getLastChapterUrl(MANGA.OP)
    if (!newChapterLink) return

    const savedChapterLink = await getLastChapterSend(CHAPTER_CHANNEL_ID!)

    if (newChapterLink !== savedChapterLink) {
        console.log(`[${new Date().toLocaleString()}] New chapter available, sending notification...`)
        const users = await getUsersMessageReactions(REACTIONS_CHANNEL_ID!, REACTION_MESSAGE_ID!)
        const userIds = users.map((user) => user.id)

        await sendMessage(CHAPTER_CHANNEL_ID!, newChapterLink, userIds)
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
