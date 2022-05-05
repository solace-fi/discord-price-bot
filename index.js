const axios = require('axios')
const Discord = require('discord.js')
const client = new Discord.Client()

// variables
const coinId = 'solace';
const guildId = '832767444488945725';
const botSecret = '';


function getPrices() {


	// API for price data.
	axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`).then(res => {
		// If we got a valid response
		if(res.data && res.data[0].current_price && res.data[0].price_change_percentage_24h) {
			let currentPrice = res.data[0].current_price || 0 // Default to zero
			let priceChange = res.data[0].price_change_percentage_24h || 0 // Default to zero
			let symbol = res.data[0].symbol || '?' 
			
			client.user.setPresence({
				game: {
					// Example: "Watching -5,52% | BTC"
					name: `${priceChange.toFixed(2)}% | ${symbol.toUpperCase()}`,
					type: 3 // Use activity type 3 which is "Watching"
				}
			})
			console.log('Updated price to', currentPrice)
			client.guilds.find(guild => guild.id === `${guildId}`).me.setNickname(`${symbol} $${(currentPrice).toLocaleString().replace(/,/g,',')}`)

			
		}
		else
			console.log('Could not load player count data for', process.env.COIN_ID)

	}).catch(err => console.log('Error at api.coingecko.com data:', err))
}

// Runs when client connects to Discord.
client.on('ready', () => {
	console.log('Logged in as', client.user.tag)

	getPrices() // Ping server once on startup
	// Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
	setInterval(getPrices, Math.max(1, process.env.MC_PING_FREQUENCY || 1) * 60 * 1000)
})

// Login to Discord
client.login(`${botSecret}`)
