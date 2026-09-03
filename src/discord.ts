import { Client, GatewayIntentBits, TextChannel } from 'discord.js'

export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
})

export async function getLastChapterSend(channelId: string): Promise<string | null> {
    try {
        const channel = (await client.channels.fetch(channelId)) as TextChannel
        if (!channel) return null

        const lastMessage = (await channel.messages.fetch({ limit: 1 })).first()
        if (!lastMessage) return null

        const match = lastMessage.content.match(/(https:\/\/[^\s]+)/)
        return match ? match[0] : null
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Error while fetching the last chapter link :`, error)
        return null
    }
}

export async function sendMessage(channelId: string, userId: string, lien: string) {
    try {
        const message = `Nouveau chapitre de disponible !\nLien : ${lien}`

        const channel = (await client.channels.fetch(channelId)) as TextChannel
        if (channel) await channel.send(message + `\n@everyone`)

        const user = await client.users.fetch(userId)
        if (user) await user.send(message)

        console.log(`[${new Date().toLocaleString()}] Message sent successfully to Discord.`)
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Error sending message :`, error)
    }
}
