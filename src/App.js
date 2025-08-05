import React, { useState, useEffect } from 'react';
import './App.css';
import PlantList from './components/PlantList';
import AddPlantForm from './components/AddPlantForm';
import Dashboard from './components/Dashboard';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import weatherService from './services/weatherService';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('about'); // about, login, app
  const [plants, setPlants] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [userLocation, setUserLocation] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('botanica-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('app');
    }

    const savedPlants = localStorage.getItem('botanica-plants');
    if (savedPlants) {
      setPlants(JSON.parse(savedPlants));
    }
    
    const savedLocation = localStorage.getItem('botanica-location');
    if (savedLocation) {
      setUserLocation(savedLocation);
      fetchWeather(savedLocation);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('botanica-plants', JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('botanica-location', userLocation);
      fetchWeather(userLocation);
    }
  }, [userLocation]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('botanica-user', JSON.stringify(userData));
    setCurrentView('app');
    showNotification('Welcome to Botanica! 🌱', 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('botanica-user');
    setCurrentView('about');
    showNotification('Logged out successfully', 'info');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchWeather = async (location) => {
    if (!location) return;
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(location),
        weatherService.getWeatherForecast(location, 5)
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  };

  const addPlant = (plant) => {
    const plantedDate = plant.plantedDate ? new Date(plant.plantedDate) : new Date();
    const newPlant = {
      id: Date.now(),
      ...plant,
      plantedDate,
      lastWatered: null,
      lastFed: null,
      nextWatering: new Date(Date.now() + plant.wateringFrequency * 24 * 60 * 60 * 1000),
      nextFeeding: new Date(Date.now() + plant.feedingFrequency * 24 * 60 * 60 * 1000)
    };
    setPlants([...plants, newPlant]);
    
    // Show success notification and redirect to dashboard
    const plantTypeText = plant.autoPopulated ? plant.plantType : 'plant';
    showNotification(`🌱 ${plant.name} (${plantTypeText}) added successfully!`, 'success');
    setActiveTab('dashboard');
  };

  const updatePlant = (updatedPlant) => {
    setPlants(plants.map(plant => 
      plant.id === updatedPlant.id ? updatedPlant : plant
    ));
  };

  const deletePlant = (plantId) => {
    setPlants(plants.filter(plant => plant.id !== plantId));
  };

  const markWatered = (plantId) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      const now = new Date();
      let wateringFrequency = plant.wateringFrequency;
      
      // Apply weather-based adjustment for outdoor plants
      if (plant.plantType === 'outdoor' && weather) {
        const adjustment = weatherService.calculateWateringAdjustment(weather, plant.plantType);
        wateringFrequency = Math.round(plant.wateringFrequency / adjustment);
      }
      
      const updatedPlant = {
        ...plant,
        lastWatered: now,
        nextWatering: new Date(now.getTime() + wateringFrequency * 24 * 60 * 60 * 1000)
      };
      updatePlant(updatedPlant);
    }
  };

  const markFed = (plantId) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      const now = new Date();
      const updatedPlant = {
        ...plant,
        lastFed: now,
        nextFeeding: new Date(now.getTime() + plant.feedingFrequency * 24 * 60 * 60 * 1000)
      };
      updatePlant(updatedPlant);
    }
  };

  // Render different views based on current state
  if (currentView === 'about') {
    return (
      <div className="App">
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        <AboutUs onGetStarted={() => setCurrentView('login')} />
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="App">
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        <Login 
          onLogin={handleLogin} 
          onBackToAbout={() => setCurrentView('about')} 
        />
      </div>
    );
  }

  // Main app view (authenticated)
  return (
    <div className="App">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <header className="App-header">
        <div className="header-content">
          <h1>🌱 Botanica</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}!</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'plants' ? 'active' : ''}
            onClick={() => setActiveTab('plants')}
          >
            My Plants
          </button>
          <button 
            className={activeTab === 'add' ? 'active' : ''}
            onClick={() => setActiveTab('add')}
          >
            Add Plant
          </button>
        </nav>
      </header>

      <main className="App-main">
        {!userLocation && currentView === 'app' && (
          <div className="location-setup">
            <h3>🌍 Set Your Location</h3>
            <p>Enter your city to get weather-based care recommendations for outdoor plants:</p>
            <div className="location-input">
              <input
                type="text"
                placeholder="e.g., New York, London, Tokyo"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchWeather(userLocation)}
              />
              <button onClick={() => fetchWeather(userLocation)} className="btn-primary">
                Set Location
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard 
            plants={plants} 
            markWatered={markWatered} 
            markFed={markFed}
            weather={weather}
            forecast={forecast}
            userLocation={userLocation}
            onLocationChange={setUserLocation}
          />
        )}
        {activeTab === 'plants' && (
          <PlantList 
            plants={plants} 
            updatePlant={updatePlant} 
            deletePlant={deletePlant}
            markWatered={markWatered}
            markFed={markFed}
            weather={weather}
          />
        )}
        {activeTab === 'add' && (
          <AddPlantForm onAddPlant={addPlant} />
        )}
      </main>
    </div>
  );
}

export default App;
