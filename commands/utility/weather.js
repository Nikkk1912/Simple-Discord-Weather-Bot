const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
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

    //Geocode API call
    const apiUrl = `https://geocode.maps.co/search?city=${city}&api_key=${process.env.GEOCODING_KEY}`;
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

        //Open-meteo API call
        //parameters for api call
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


            //Creating embed for discord message
            const temperatureEmbed = new EmbedBuilder().setTitle(`Temperature in city ${cityForPrint} is ${currentTemperature}°C`);
            let picture;

            //Changing embed color and picture according to temp
            if (currentTemperature <= -20) 
            {
              temperatureEmbed.setColor("Purple");
              picture = new AttachmentBuilder('img/cold.png');
              temperatureEmbed.setThumbnail('attachment://cold.png');
            } 
            else if (currentTemperature <= -5 && currentTemperature > -20) 
            {
              temperatureEmbed.setColor("Blue");
              picture = new AttachmentBuilder('img/cold.png');
              temperatureEmbed.setThumbnail('attachment://cold.png')
            } 
            else if (currentTemperature <= 5 && currentTemperature > -5) 
            {
              temperatureEmbed.setColor("White");
              picture = new AttachmentBuilder('img/normal.png');
              temperatureEmbed.setThumbnail('attachment://normal.png');
            } 
            else if (currentTemperature <= 20 && currentTemperature > 5) 
            {
              temperatureEmbed.setColor("Yellow");
              picture = new AttachmentBuilder('img/hot.png');
              temperatureEmbed.setThumbnail('attachment://hot.png');
            } 
            else if (currentTemperature > 20) 
            {
              temperatureEmbed.setColor("Red");
              picture = new AttachmentBuilder('img/hot.png');
              temperatureEmbed.setThumbnail('attachment://hot.png');
            }

            //Sending reply to server
            console.log(currentTemperature);
            interaction.reply({ embeds: [temperatureEmbed], files: [picture] });

          })
          .catch((error) => {
            console.error('Error fetching weather data:', error);
            interaction.reply('Error fetching weather data:', error);
          });

      })
      .catch((error) => {
        console.error("Error1:", error);
        interaction.reply("Invalid city name");
      });
  },
};
