import * as fs from "fs"
import cron from "node-cron"
import { getCoingeckoData } from "../price"
import { logger } from "../utils"
import { CoingeckoData, CachedCoingeckoData } from "../types"

export async function startCacheCronjob() {
    logger.info("Starting cache cronjob")
    
    cron.schedule('*/1 * * * *', async () => {
        logger.info(`${new Date()} - Coingecko API request started`)

        try {
            const coingeckoData: CoingeckoData = await getCoingeckoData()
            const {current_price, price_change_percentage_24h} = coingeckoData

            if (current_price !== 0 && price_change_percentage_24h !== 0) {
                const cachedCoingeckoData: CachedCoingeckoData = {
                    current_price: current_price,
                    price_change_percentage_24h: price_change_percentage_24h,
                    last_updated: new Date()
                }
    
                fs.writeFileSync(`./cache/cached_price_data.json`, JSON.stringify(cachedCoingeckoData))
                logger.info("Successful caching of Coingecko API request")
            } else {
                logger.error(`Faulty Coingecko API response, did not cache at ${new Date()}`)
            }
        } catch(e) {
            logger.error(`Failed caching of Coingecko API request at ${new Date()}`)
        }
    });
}