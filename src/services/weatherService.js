class WeatherService {
  constructor() {
    this.API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
    this.BASE_URL = 'https://api.openweathermap.org/data/2.5';
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  async getCurrentWeather(location) {
    const cacheKey = `current_${location}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      if (!this.API_KEY) {
        // Return mock data if no API key is available
        return this.getMockWeatherData();
      }

      const response = await fetch(
        `${this.BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${this.API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      const weatherData = this.processWeatherData(data);
      
      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });
      
      return weatherData;
    } catch (error) {
      console.warn('Weather API failed, using mock data:', error);
      return this.getMockWeatherData();
    }
  }

  async getWeatherForecast(location, days = 5) {
    const cacheKey = `forecast_${location}_${days}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      if (!this.API_KEY) {
        return this.getMockForecastData(days);
      }

      const response = await fetch(
        `${this.BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${this.API_KEY}&units=metric&cnt=${days * 8}`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }
      
      const data = await response.json();
      const forecastData = this.processForecastData(data);
      
      this.cache.set(cacheKey, {
        data: forecastData,
        timestamp: Date.now()
      });
      
      return forecastData;
    } catch (error) {
      console.warn('Forecast API failed, using mock data:', error);
      return this.getMockForecastData(days);
    }
  }

  processWeatherData(data) {
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind?.speed || 0,
      precipitation: data.rain?.['1h'] || data.snow?.['1h'] || 0,
      pressure: data.main.pressure,
      uvIndex: 0, // Not available in current weather, would need separate UV API
      location: data.name,
      country: data.sys.country,
      timestamp: Date.now()
    };
  }

  processForecastData(data) {
    const dailyData = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          temperature: {
            min: item.main.temp,
            max: item.main.temp
          },
          humidity: item.main.humidity,
          precipitation: item.rain?.['3h'] || item.snow?.['3h'] || 0,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        };
      } else {
        dailyData[date].temperature.min = Math.min(dailyData[date].temperature.min, item.main.temp);
        dailyData[date].temperature.max = Math.max(dailyData[date].temperature.max, item.main.temp);
        dailyData[date].precipitation += item.rain?.['3h'] || item.snow?.['3h'] || 0;
      }
    });

    return Object.values(dailyData).map(day => ({
      ...day,
      temperature: {
        min: Math.round(day.temperature.min),
        max: Math.round(day.temperature.max)
      }
    }));
  }

  getMockWeatherData() {
    return {
      temperature: 22,
      humidity: 65,
      description: 'partly cloudy',
      icon: '02d',
      windSpeed: 5.2,
      precipitation: 0,
      pressure: 1013,
      uvIndex: 6,
      location: 'Demo City',
      country: 'US',
      timestamp: Date.now()
    };
  }

  getMockForecastData(days) {
    const forecast = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      forecast.push({
        date: date.toDateString(),
        temperature: {
          min: 18 + Math.random() * 5,
          max: 25 + Math.random() * 8
        },
        humidity: 60 + Math.random() * 20,
        precipitation: Math.random() > 0.7 ? Math.random() * 5 : 0,
        description: ['sunny', 'partly cloudy', 'cloudy', 'light rain'][Math.floor(Math.random() * 4)],
        icon: '02d'
      });
    }
    return forecast;
  }

  calculateWateringAdjustment(weather, plantType) {
    if (plantType !== 'outdoor') return 1;

    let adjustment = 1;
    
    // Temperature adjustments
    if (weather.temperature > 30) {
      adjustment *= 1.4; // Much hotter, water more
    } else if (weather.temperature > 25) {
      adjustment *= 1.2; // Hot, water more
    } else if (weather.temperature < 10) {
      adjustment *= 0.7; // Cold, water less
    }

    // Humidity adjustments
    if (weather.humidity < 30) {
      adjustment *= 1.3; // Very dry, water more
    } else if (weather.humidity < 50) {
      adjustment *= 1.1; // Dry, water more
    } else if (weather.humidity > 80) {
      adjustment *= 0.8; // Very humid, water less
    }

    // Recent precipitation adjustments
    if (weather.precipitation > 5) {
      adjustment *= 0.3; // Heavy rain, water much less
    } else if (weather.precipitation > 1) {
      adjustment *= 0.6; // Light rain, water less
    }

    // Wind adjustments (increases evaporation)
    if (weather.windSpeed > 15) {
      adjustment *= 1.2; // Strong wind, water more
    }

    return Math.max(0.2, Math.min(2.0, adjustment)); // Clamp between 0.2x and 2x
  }

  getWeatherRecommendation(weather, plantType) {
    if (plantType !== 'outdoor') return null;

    const recommendations = [];

    if (weather.temperature > 35) {
      recommendations.push('🌡️ Extreme heat - provide shade and increase watering');
    } else if (weather.temperature > 30) {
      recommendations.push('☀️ Very hot - water early morning or evening');
    } else if (weather.temperature < 5) {
      recommendations.push('❄️ Freezing risk - protect sensitive plants');
    }

    if (weather.precipitation > 5) {
      recommendations.push('🌧️ Heavy rain expected - reduce or skip watering');
    } else if (weather.precipitation > 1) {
      recommendations.push('🌦️ Light rain expected - may reduce watering needs');
    }

    if (weather.humidity < 30) {
      recommendations.push('🏜️ Very dry air - increase watering frequency');
    }

    if (weather.windSpeed > 15) {
      recommendations.push('💨 Strong winds - check soil moisture more frequently');
    }

    return recommendations;
  }
}

export default new WeatherService();