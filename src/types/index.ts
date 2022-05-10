export type CoingeckoData = {
    current_price: number
    price_change_percentage_24h: number
}

export type CachedCoingeckoData = {
    current_price: number
    price_change_percentage_24h: number
    last_updated: Date
}