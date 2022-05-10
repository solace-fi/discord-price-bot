import axios from "axios"
import { logger } from "../utils"
import { CoingeckoData } from "../types"

export async function getCoingeckoData(): Promise<CoingeckoData> {
    const url = "https://api.coingecko.com/api/v3/coins/markets"
    
    const params = {
        vs_currency: "usd",
        ids: process.env.COIN_ID,
        order: "market_cap_desc",
        per_page: 1,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h"
    }

    try {
        const response = await axios.get(url, { params })

        if (response.data.length == 0) {
            logger.error("getCoingeckoData - did not return any data in GET request to Coingecko API")
            return emptyCoingeckoData // Error handling for no data returned
        }

        if (!response.data[0].hasOwnProperty("current_price")) {
            logger.error("getCoingeckoData - API response did not contain current_price property")
            return emptyCoingeckoData // Error handling for no current_price property
        }

        if (!response.data[0].hasOwnProperty("price_change_percentage_24h")) {
            logger.error("getCoingeckoData - API response did not contain price_change_percentage_24h property")
            return emptyCoingeckoData // Error handling for no price_change_percentage_24h property
        }

        const { current_price, price_change_percentage_24h } = response.data[0]

        return {
            current_price: current_price,
            price_change_percentage_24h: price_change_percentage_24h
        }
    } catch(e) {
        logger.error("getCoingeckoData - error with GET request to Coingecko API");
        logger.error(e)
        return emptyCoingeckoData
    }
}

const emptyCoingeckoData: CoingeckoData = {
    current_price: 0,
    price_change_percentage_24h: 0,
}