import { Client, GatewayIntentBits, TextChannel, User } from 'discord.js'

export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
})

export async function getUsersMessageReactions(channelId: string, messageId: string): Promise<User[]> {
    try {
        const channel = (await client.channels.fetch(channelId)) as TextChannel
        if (!channel) return []

        const message = await channel.messages.fetch(messageId)
        if (!message) return []

        const reactions = message.reactions.cache

        if (reactions.size === 0) {
            return []
        }

        const usersMap = new Map<string, User>()

        for (const reaction of reactions.values()) {
            const fetchedUsers = await reaction.users.fetch()
            console.log(fetchedUsers)
            fetchedUsers.forEach((u) => {
                console.log(u)
                return usersMap.set(u.id, u)
            })
        }

        return Array.from(usersMap.values())
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Error fetching users message reactions :`, error)
        return []
    }
}

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

export async function sendMessage(channelId: string, link: string, userIds: string[]): Promise<void> {
    try {
        const message = `Nouveau chapitre de disponible !\nLien : ${link}`

        const channel = (await client.channels.fetch(channelId)) as TextChannel
        if (channel) await channel.send(message + `\n@everyone`)

        await Promise.all(
            userIds.map(async (userId) => {
                const user = await client.users.fetch(userId)
                await user.send(message)
            })
        )

        console.log(`[${new Date().toLocaleString()}] Message sent successfully to Discord.`)
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Error sending message :`, error)
    }
}
