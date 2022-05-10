import Discord from "discord.js"
import * as fs from "fs"
import cron from "node-cron"
import { logger } from "../utils"
import { CachedCoingeckoData } from "../types"

export async function startDiscordDisplayCronjob(client: Discord.Client) {
    logger.info("Starting Discord display cronjob")
    
    cron.schedule('*/1 * * * *', async () => {

        try {
            const cachedCoingeckoData: CachedCoingeckoData = JSON.parse(fs.readFileSync("./cache/cached_price_data.json").toString())
            const {current_price, price_change_percentage_24h} = cachedCoingeckoData
            
            if (current_price == 0 || price_change_percentage_24h == 0) {
                logger.error(`Faulty cache hit at ${new Date()}`)
                return
            }

            if (!client.user) {
                logger.error("startDiscordDisplayCronjob - client did not contain 'user' property")
                return
            }

            if (!client.guilds) {
                logger.error("startDiscordDisplayCronjob - client did not contain 'guilds' property")
                return
            }

            logger.info("startDiscordDisplayCronjob - Successful cache hit")

            client.user.setActivity(`24h: ${price_change_percentage_24h.toFixed(2)}%`, {type: 3})
            const guild = await client.guilds.fetch(process.env.GUILD_ID!)

            if (!guild.members) {
                logger.error("startDiscordDisplayCronjob - GuildManager object did not have expected 'members' property")
                return
            }

            await guild.members.edit(process.env.CLIENT_ID!, {nick: `$${current_price.toFixed(3)} (${price_change_percentage_24h < 0 ? "↘" : "↗"})`})

        } catch(e) {
            logger.error(`startDiscordDisplayCronjob - Cache miss at ${new Date()}`)
        }
    });
}
