const { SlashCommandBuilder } = require("discord.js");
const { fetchWeatherApi } = require('openmeteo');
require("dotenv").config();


module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Gives temperature in city")
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("Where to check weather")
        .setRequired(true)
    ),
  async execute(interaction) {
    let city = interaction.options.getString("city");
    let cityForPrint = city[0].toUpperCase() + city.slice(1).toLowerCase();

    let data;


    const apiUrl = `https://geocode.maps.co/search?city=${city}&api_key=${process.env.GEOCODING_KEY}`;

    //API CALL
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
          interaction.reply("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        data = responseData;
        const params = {
            "latitude": data[0].lat,
            "longitude": data[0].lon,
            "current": "temperature_2m",
            "hourly": "temperature_2m",
            "daily": ["temperature_2m_max", "temperature_2m_min"],
            "timezone": "Europe/Moscow",
            "forecast_days": 1
          };
          
          const url = "https://api.open-meteo.com/v1/forecast";
          
          fetchWeatherApi(url, params)
            .then((responses) => {
              const response = responses[0];
              const utcOffsetSeconds = response.utcOffsetSeconds();
              const current = response.current();
          
              const weatherData = {
                current: {
                  time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                  temperature2m: current.variables(0).value(),
                }
              };
      
              const currentTemperature = Math.round(weatherData.current.temperature2m.toFixed(1));
              interaction.reply(`Temperature in city ${cityForPrint} is ${currentTemperature}°C`);
          
            })
            .catch((error) => {
              console.error('Error fetching weather data:', error);
              interaction.reply('Error fetching weather data:', error);
            });

        //interaction.reply(`City: ${city}, long: ${data[0].lon}, lat: ${data[0].lat}`);
      })
      .catch((error) => {
        console.error("Error1:", error);
        interaction.reply("Invalid city name");
      });
    //-------------

  },
};
