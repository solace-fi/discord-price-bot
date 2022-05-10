# Quick Start

1. Provide valid .env

2. `./install.sh` => Install dependencies

3. `./run.sh` => Build and deploy bot


# Prerequisites

Discord bot invited to desired server


# Discord Cryptocurrency Price Bot

Requests price information from Coingecko API every minute. If valid response, stores filtered data in a local cache (cache/cached_price_data.json)

Discord bot retrieves information from cache and displays relevant data


# Design philosophy

Written from a 'paranoid about bot crashing' approach:

- Typescript to minimise type, null and undefined errors

- winston npm package for logging

- Discord bot retrieves information from local cache for maximum data availability (in case last API call had an error)

- pm2 to daemonize the Discord bot, and to restart the bot automatically if it crashes for some reaason