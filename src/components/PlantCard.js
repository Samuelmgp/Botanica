import React, { useState } from 'react';
import weatherService from '../services/weatherService';

const PlantCard = ({ 
  plant, 
  onEdit, 
  onDelete, 
  onMarkWatered, 
  onMarkFed, 
  isEditing, 
  onSaveEdit, 
  onCancelEdit,
  weather 
}) => {
  const [editForm, setEditForm] = useState({
    name: plant.name,
    plantType: plant.plantType || 'indoor',
    sunRequirement: plant.sunRequirement || 'partial',
    lifecycle: plant.lifecycle || 'perennial',
    location: plant.location,
    wateringFrequency: plant.wateringFrequency,
    feedingFrequency: plant.feedingFrequency,
    soilType: plant.soilType || 'well-draining',
    matureSize: plant.matureSize || 'medium',
    bloomingSeason: plant.bloomingSeason || '',
    notes: plant.notes
  });
  
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };

  const getDaysUntil = (date) => {
    if (!date) return 0;
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusClass = (daysUntil) => {
    if (daysUntil < 0) return 'overdue';
    if (daysUntil === 0) return 'due-today';
    if (daysUntil <= 2) return 'due-soon';
    return 'good';
  };

  const getPlantAge = () => {
    if (!plant.plantedDate) return null;
    const planted = new Date(plant.plantedDate);
    const now = new Date();
    const diffMonths = Math.floor((now - planted) / (1000 * 60 * 60 * 24 * 30.44));
    
    if (diffMonths < 1) return 'New seedling';
    if (diffMonths < 6) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} old`;
    
    const years = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    
    if (years === 0) return `${diffMonths} months old`;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''} old`;
    return `${years}y ${remainingMonths}m old`;
  };

  const getSunIcon = (sunRequirement) => {
    switch (sunRequirement) {
      case 'full-sun': return '☀️';
      case 'partial': return '⛅';
      case 'shade': return '🌑';
      default: return '☀️';
    }
  };

  const getLifecycleIcon = (lifecycle) => {
    switch (lifecycle) {
      case 'annual': return '🌱';
      case 'perennial': return '🌿';
      case 'biennial': return '🌾';
      default: return '🌿';
    }
  };

  const getWeatherImpact = () => {
    if (plant.plantType !== 'outdoor' || !weather) return null;
    
    const recommendations = weatherService.getWeatherRecommendation(weather, plant.plantType);
    const adjustment = weatherService.calculateWateringAdjustment(weather, plant.plantType);
    
    return {
      recommendations,
      adjustment,
      adjustmentText: adjustment > 1.2 ? 'Water more frequently' : 
                     adjustment < 0.8 ? 'Water less frequently' : 
                     'Normal watering schedule'
    };
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedPlant = {
      ...plant,
      ...editForm,
      wateringFrequency: parseInt(editForm.wateringFrequency),
      feedingFrequency: parseInt(editForm.feedingFrequency)
    };
    onSaveEdit(updatedPlant);
  };

  const wateringDays = getDaysUntil(plant.nextWatering);
  const feedingDays = getDaysUntil(plant.nextFeeding);
  const plantAge = getPlantAge();
  const weatherImpact = getWeatherImpact();

  if (isEditing) {
    return (
      <div className="plant-card editing">
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              placeholder="Plant name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={editForm.species}
              onChange={(e) => setEditForm({...editForm, species: e.target.value})}
              placeholder="Species"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={editForm.location}
              onChange={(e) => setEditForm({...editForm, location: e.target.value})}
              placeholder="Location"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Water every</label>
              <input
                type="number"
                value={editForm.wateringFrequency}
                onChange={(e) => setEditForm({...editForm, wateringFrequency: e.target.value})}
                min="1"
                max="365"
              />
              <span>days</span>
            </div>
            <div className="form-group">
              <label>Feed every</label>
              <input
                type="number"
                value={editForm.feedingFrequency}
                onChange={(e) => setEditForm({...editForm, feedingFrequency: e.target.value})}
                min="1"
                max="365"
              />
              <span>days</span>
            </div>
          </div>
          <div className="form-group">
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
              placeholder="Notes"
              rows="2"
            />
          </div>
          <div className="card-actions">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" onClick={onCancelEdit} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`plant-card ${isExpanded ? 'expanded' : 'compact'}`}>
      <div className="plant-header">
        <h3>{plant.name}</h3>
        <div className="plant-actions">
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="btn-icon" 
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? "−" : "+"}
          </button>
          <button onClick={onEdit} className="btn-icon" title="Edit">✏️</button>
          <button onClick={onDelete} className="btn-icon delete" title="Delete">🗑️</button>
        </div>
      </div>
      
      {/* Compact view - always visible */}
      <div className="plant-compact-info">
        <div className="plant-attributes-compact">
          <span className="plant-type-compact">{plant.plantType || 'Indoor'}</span>
          <span className="plant-sun-compact">{getSunIcon(plant.sunRequirement)}</span>
          {plant.category && <span className="plant-category-compact">{plant.category}</span>}
        </div>
        
        <div className="care-status-compact">
          <div className={`care-indicator ${getStatusClass(wateringDays)}`}>
            💧 {wateringDays < 0 ? `${Math.abs(wateringDays)}d overdue` :
                wateringDays === 0 ? 'Due today' :
                `${wateringDays}d`}
          </div>
          <div className={`care-indicator ${getStatusClass(feedingDays)}`}>
            🌿 {feedingDays < 0 ? `${Math.abs(feedingDays)}d overdue` :
                feedingDays === 0 ? 'Due today' :
                `${feedingDays}d`}
          </div>
        </div>
      </div>

      {/* Expanded view - only when expanded */}
      {isExpanded && (
        <>
          <div className="plant-info">
            <div className="plant-basic-info">
              {plant.scientificName && plant.scientificName !== 'Unknown species' && (
                <p className="plant-scientific">
                  <em>{plant.scientificName}</em>
                  {plant.category && <span className="plant-category"> • {plant.category}</span>}
                </p>
              )}
              
              <div className="plant-attributes">
                <span className="plant-type">{plant.plantType || 'Indoor'}</span>
                <span className="plant-lifecycle">{getLifecycleIcon(plant.lifecycle)} {plant.lifecycle || 'Perennial'}</span>
                <span className="plant-sun">{getSunIcon(plant.sunRequirement)} {plant.sunRequirement || 'Partial'}</span>
              </div>
              
              {plantAge && <p className="plant-age">🗓️ {plantAge}</p>}
              {plant.location && <p className="plant-location">📍 {plant.location}</p>}
              {plant.bloomingSeason && <p className="plant-blooming">🌸 Blooms in {plant.bloomingSeason}</p>}
              
              {!plant.autoPopulated && (
                <div className="unknown-plant-note">
                  <span className="unknown-icon">❓</span>
                  <span>Using general care guidelines - monitor and adjust as needed</span>
                </div>
              )}
            </div>
            
            {plant.facts && plant.facts.length > 0 && (
              <div className="plant-facts">
                <h4>🌿 Plant Facts & Tips</h4>
                <div className="facts-list">
                  {plant.facts.slice(0, 3).map((fact, index) => (
                    <div key={index} className="plant-fact">
                      <span className="fact-bullet">•</span>
                      <span className="fact-text">{fact}</span>
                    </div>
                  ))}
                  {plant.facts.length > 3 && (
                    <div className="more-facts">
                      +{plant.facts.length - 3} more facts
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {plant.careNotes && (
              <div className="care-notes">
                <h4>💡 Care Tips</h4>
                <p>{plant.careNotes}</p>
              </div>
            )}
          </div>

          {weatherImpact && (
            <div className="weather-impact">
              <div className="weather-header">
                <span className="weather-title">🌤️ Weather Impact</span>
                <span className="weather-adjustment">{weatherImpact.adjustmentText}</span>
              </div>
              {weatherImpact.recommendations && weatherImpact.recommendations.length > 0 && (
                <div className="weather-recommendations">
                  {weatherImpact.recommendations.map((rec, index) => (
                    <div key={index} className="weather-rec">{rec}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="care-schedule">
            <div className={`care-item ${getStatusClass(wateringDays)}`}>
              <div className="care-info">
                <span className="care-type">💧 Watering</span>
                <span className="care-status">
                  {wateringDays < 0 ? `${Math.abs(wateringDays)} days overdue` :
                   wateringDays === 0 ? 'Due today' :
                   `In ${wateringDays} days`}
                </span>
                <small>Last watered: {formatDate(plant.lastWatered)}</small>
              </div>
              <button onClick={onMarkWatered} className="btn-care">Watered</button>
            </div>
            
            <div className={`care-item ${getStatusClass(feedingDays)}`}>
              <div className="care-info">
                <span className="care-type">🌿 Feeding</span>
                <span className="care-status">
                  {feedingDays < 0 ? `${Math.abs(feedingDays)} days overdue` :
                   feedingDays === 0 ? 'Due today' :
                   `In ${feedingDays} days`}
                </span>
                <small>Last fed: {formatDate(plant.lastFed)}</small>
              </div>
              <button onClick={onMarkFed} className="btn-care">Fed</button>
            </div>
          </div>
          
          {plant.notes && (
            <div className="plant-notes">
              <p>{plant.notes}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlantCard;