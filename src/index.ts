import Discord from "discord.js"
import { logger } from "./utils"
import { startCacheCronjob } from "./cache"
import { startDiscordDisplayCronjob } from "./discord"
require('dotenv').config()
const { Client, Intents } = Discord
const client = new Client({intents: Intents.FLAGS.GUILDS})

async function main() {
    client.on('ready', async () => {
        await startCacheCronjob()

        if (!client.user) {logger.error("index.ts: client.on - client did not contain user property")}
        else if (!client.user.tag) {logger.error("index.ts: client.on - client.user did not contain tag property")}
        else {
            logger.info(`Logged in as ${client.user.tag}`)
            await startDiscordDisplayCronjob(client)
            // client.user.setAvatar("./images/solace-logo.png")
        }        
    })
}

main()
    .catch((e) => {
        logger.error(`index.ts - Discord bot crashed at ${new Date()}`)  
        logger.error(e)
    })

client.login(process.env.TOKEN);