# Discord Weather Bot

## Overview

This is a small Discord bot project built using Discord.js. 
The main feature of the bot is to provide the current temperature in a specific city.
It utilizes geocoding API to translate the city name to coordinates and then uses the OpenMeteo API to retrieve and display weather information.

## Features

- Translate city names to coordinates using geocoding API.
- Retrieve weather information from OpenMeteo API.
- Get the current temperature in a specified city.

## Usage

1. Invite the bot to your Discord server.
2. Use the command `/weather <city>` to get the current temperature in the specified city.

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Nikkk1912/discord-weather-bot/tree/main
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
  
   Create a .env file in the project root and add the following lines:
   ```
   TOKEN = your_discord_bot_token
   CLIENT_ID = your_discord_client_id
   GUILD_ID = your_discord_guild_id
   GEOCODING_KEY = your_geocoding_api_key
   ```

5. **Deploy all commands:**

   ```bash
   node deploy-commands.js
   ```

6. **Run bot:**

   ```bash
   node index.js
   ```
