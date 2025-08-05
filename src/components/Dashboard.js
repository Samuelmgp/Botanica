import React from 'react';

const Dashboard = ({ plants, markWatered, markFed, weather, forecast, userLocation, onLocationChange }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getTasks = () => {
    const tasks = [];
    
    plants.forEach(plant => {
      const wateringDate = new Date(plant.nextWatering);
      const feedingDate = new Date(plant.nextFeeding);
      
      wateringDate.setHours(0, 0, 0, 0);
      feedingDate.setHours(0, 0, 0, 0);
      
      const wateringDiff = Math.ceil((wateringDate - today) / (1000 * 60 * 60 * 24));
      const feedingDiff = Math.ceil((feedingDate - today) / (1000 * 60 * 60 * 24));
      
      if (wateringDiff <= 2) {
        tasks.push({
          type: 'watering',
          plant: plant,
          daysUntil: wateringDiff,
          action: () => markWatered(plant.id)
        });
      }
      
      if (feedingDiff <= 2) {
        tasks.push({
          type: 'feeding',
          plant: plant,
          daysUntil: feedingDiff,
          action: () => markFed(plant.id)
        });
      }
    });
    
    return tasks.sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const getTaskStatus = (daysUntil) => {
    if (daysUntil < 0) return { class: 'overdue', text: `${Math.abs(daysUntil)} days overdue` };
    if (daysUntil === 0) return { class: 'due-today', text: 'Due today' };
    if (daysUntil === 1) return { class: 'due-soon', text: 'Due tomorrow' };
    return { class: 'due-soon', text: `Due in ${daysUntil} days` };
  };

  const getStats = () => {
    const totalPlants = plants.length;
    const outdoorPlants = plants.filter(plant => plant.plantType === 'outdoor').length;
    const annualPlants = plants.filter(plant => plant.lifecycle === 'annual').length;
    
    const overdueWatering = plants.filter(plant => {
      const wateringDate = new Date(plant.nextWatering);
      wateringDate.setHours(0, 0, 0, 0);
      return wateringDate < today;
    }).length;
    
    const overdueFeeding = plants.filter(plant => {
      const feedingDate = new Date(plant.nextFeeding);
      feedingDate.setHours(0, 0, 0, 0);
      return feedingDate < today;
    }).length;

    const dueToday = plants.filter(plant => {
      const wateringDate = new Date(plant.nextWatering);
      const feedingDate = new Date(plant.nextFeeding);
      wateringDate.setHours(0, 0, 0, 0);
      feedingDate.setHours(0, 0, 0, 0);
      return wateringDate.getTime() === today.getTime() || feedingDate.getTime() === today.getTime();
    }).length;

    return { totalPlants, outdoorPlants, annualPlants, overdueWatering, overdueFeeding, dueToday };
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
    if (desc.includes('partly') || desc.includes('few')) return '⛅';
    if (desc.includes('storm') || desc.includes('thunder')) return '⛈️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    return '🌤️';
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const tasks = getTasks();
  const stats = getStats();

  if (plants.length === 0) {
    return (
      <div className="dashboard">
        <h2>Dashboard</h2>
        <div className="empty-state">
          <p>🌱 Welcome to Botanica!</p>
          <p>Add your first plant to start tracking care schedules.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        {userLocation && (
          <div className="location-display">
            <span>📍 {userLocation}</span>
            <button 
              onClick={() => onLocationChange('')} 
              className="btn-secondary small"
              title="Change location"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {weather && stats.outdoorPlants > 0 && (
        <div className="weather-section">
          <div className="weather-card">
            <div className="weather-current">
              <div className="weather-main">
                <span className="weather-temp">{weather.temperature}°C</span>
                <span className="weather-desc">{getWeatherIcon(weather.description)} {weather.description}</span>
              </div>
              <div className="weather-details">
                <span>💧 {weather.humidity}% humidity</span>
                <span>💨 {weather.windSpeed} m/s wind</span>
                {weather.precipitation > 0 && <span>🌧️ {weather.precipitation}mm rain</span>}
              </div>
            </div>
            <div className="weather-outdoor-note">
              Weather affects your {stats.outdoorPlants} outdoor plant{stats.outdoorPlants > 1 ? 's' : ''}
            </div>
          </div>

          {forecast && forecast.length > 0 && (
            <div className="weather-forecast">
              <h3>5-Day Forecast</h3>
              <div className="forecast-grid">
                {forecast.slice(0, 5).map((day, index) => (
                  <div key={index} className="forecast-day">
                    <div className="forecast-date">{getFormattedDate(day.date)}</div>
                    <div className="forecast-icon">{getWeatherIcon(day.description)}</div>
                    <div className="forecast-temps">
                      <span className="temp-high">{day.temperature.max}°</span>
                      <span className="temp-low">{day.temperature.min}°</span>
                    </div>
                    <div className="forecast-desc">{day.description}</div>
                    {day.precipitation > 0 && (
                      <div className="forecast-rain">💧 {day.precipitation.toFixed(1)}mm</div>
                    )}
                    <div className="forecast-humidity">💨 {day.humidity}%</div>
                  </div>
                ))}
              </div>
              <div className="forecast-note">
                💡 Rainy days ahead? Consider reducing watering for outdoor plants.
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalPlants}</div>
          <div className="stat-label">Total Plants</div>
        </div>
        <div className="stat-card due-today">
          <div className="stat-number">{stats.dueToday}</div>
          <div className="stat-label">Due Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.outdoorPlants}</div>
          <div className="stat-label">Outdoor Plants</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.annualPlants}</div>
          <div className="stat-label">Annual Plants</div>
        </div>
        <div className="stat-card overdue">
          <div className="stat-number">{stats.overdueWatering}</div>
          <div className="stat-label">Overdue Watering</div>
        </div>
        <div className="stat-card overdue">
          <div className="stat-number">{stats.overdueFeeding}</div>
          <div className="stat-label">Overdue Feeding</div>
        </div>
      </div>

      <div className="upcoming-tasks">
        <h3>Upcoming Care Tasks</h3>
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>🎉 All caught up! No urgent care tasks.</p>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task, index) => {
              const status = getTaskStatus(task.daysUntil);
              return (
                <div key={index} className={`task-item ${status.class}`}>
                  <div className="task-info">
                    <div className="task-plant">{task.plant.name}</div>
                    <div className="task-type">
                      {task.type === 'watering' ? '💧' : '🌿'} {task.type}
                    </div>
                    <div className="task-status">{status.text}</div>
                  </div>
                  <button onClick={task.action} className="btn-care">
                    {task.type === 'watering' ? 'Mark Watered' : 'Mark Fed'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="care-calendar">
        <h3>This Week's Schedule</h3>
        <div className="week-view">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayTasks = plants.filter(plant => {
              const wateringDate = new Date(plant.nextWatering);
              const feedingDate = new Date(plant.nextFeeding);
              wateringDate.setHours(0, 0, 0, 0);
              feedingDate.setHours(0, 0, 0, 0);
              return wateringDate.getTime() === date.getTime() || feedingDate.getTime() === date.getTime();
            });

            return (
              <div key={i} className={`day-column ${i === 0 ? 'today' : ''}`}>
                <div className="day-header">
                  <div className="day-name">{date.toLocaleDateString('en', { weekday: 'short' })}</div>
                  <div className="day-date">{date.getDate()}</div>
                </div>
                <div className="day-tasks">
                  {dayTasks.length > 0 ? (
                    dayTasks.map(plant => (
                      <div key={plant.id} className="day-task">
                        {plant.name}
                      </div>
                    ))
                  ) : (
                    <div className="no-day-tasks">-</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;