import React, { useState } from 'react';
import plantInfoService from '../services/plantInfoService';

const AddPlantForm = ({ onAddPlant }) => {
  const [formData, setFormData] = useState({
    name: '',
    plantType: '', // What type of plant (tomato, basil, etc.)
    location: 'outdoor', // Indoor or Outdoor
    plantedDate: new Date().toISOString().split('T')[0],
    ageYears: 0,
    ageMonths: 0,
    notes: ''
  });
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('age') ? parseInt(value) || 0 : value
    }));

    // Show plant type suggestions
    if (name === 'plantType') {
      const plantSuggestions = plantInfoService.getPlantSuggestions(value);
      setSuggestions(plantSuggestions);
      setShowSuggestions(plantSuggestions.length > 0 && value.length > 1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({ ...prev, plantType: suggestion.label }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const calculatePlantedDate = () => {
    if (formData.ageYears === 0 && formData.ageMonths === 0) {
      return formData.plantedDate;
    }
    
    const currentDate = new Date();
    const yearsAgo = formData.ageYears || 0;
    const monthsAgo = formData.ageMonths || 0;
    
    const plantedDate = new Date(currentDate);
    plantedDate.setFullYear(currentDate.getFullYear() - yearsAgo);
    plantedDate.setMonth(currentDate.getMonth() - monthsAgo);
    
    return plantedDate.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.plantType.trim()) {
      // Get plant information from the service
      const plantInfo = plantInfoService.getPlantInfo(formData.plantType, formData.location);
      
      // Calculate actual planted date based on age if provided
      const actualPlantedDate = calculatePlantedDate();
      
      // Combine user input with auto-populated plant information
      const plantData = {
        // User provided data
        name: formData.name.trim(),
        plantType: formData.plantType.trim(),
        location: formData.location,
        plantedDate: actualPlantedDate,
        notes: formData.notes,
        
        // Auto-populated from plant database
        ...plantInfo,
        
        // Additional metadata
        autoPopulated: plantInfo.found,
        userProvided: {
          name: formData.name.trim(),
          plantType: formData.plantType.trim(),
          location: formData.location,
          plantedDate: actualPlantedDate,
          notes: formData.notes
        }
      };
      
      onAddPlant(plantData);
      
      // Reset form
      setFormData({
        name: '',
        plantType: '',
        location: 'outdoor',
        plantedDate: new Date().toISOString().split('T')[0],
        ageYears: 0,
        ageMonths: 0,
        notes: ''
      });
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="add-plant-form">
      <h2>Add New Plant</h2>
      <p className="form-description">
        Just tell us the basics - we'll handle the rest! 🌱
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Plant Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., My Tomato Plant, Basil Bush"
          />
          <small>Give your plant a unique name</small>
        </div>

        <div className="form-group plant-type-input">
          <label htmlFor="plantType">What type of plant is this? *</label>
          <input
            type="text"
            id="plantType"
            name="plantType"
            value={formData.plantType}
            onChange={handleChange}
            required
            placeholder="e.g., Tomato, Basil, Aloe, Fiddle Leaf Fig"
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <small>Enter the type of plant (we'll find care instructions for you)</small>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-name">{suggestion.label}</span>
                  <span className="suggestion-category">{suggestion.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="location">Where will you keep this plant? *</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          >
            <option value="outdoor">Outdoor</option>
            <option value="indoor">Indoor</option>
          </select>
          <small>This helps us adjust care recommendations</small>
        </div>

        <div className="age-input-section">
          <label>Plant Age (optional)</label>
          <p className="age-description">
            Either enter the planting date OR approximate age - we'll calculate the rest
          </p>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="plantedDate">Planted Date</label>
              <input
                type="date"
                id="plantedDate"
                name="plantedDate"
                value={formData.plantedDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="age-inputs">
              <span className="age-label">OR approximate age:</span>
              <div className="age-row">
                <div className="age-input">
                  <input
                    type="number"
                    id="ageYears"
                    name="ageYears"
                    value={formData.ageYears}
                    onChange={handleChange}
                    min="0"
                    max="50"
                  />
                  <label htmlFor="ageYears">Years</label>
                </div>
                <div className="age-input">
                  <input
                    type="number"
                    id="ageMonths"
                    name="ageMonths"
                    value={formData.ageMonths}
                    onChange={handleChange}
                    min="0"
                    max="11"
                  />
                  <label htmlFor="ageMonths">Months</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special observations, where you got it, current condition, etc."
            rows="3"
          />
        </div>

        <button type="submit" className="btn-primary">
          🌱 Add Plant & Get Care Schedule
        </button>
      </form>
      
      <div className="auto-populate-info">
        <h4>🤖 What we'll automatically set up for you:</h4>
        <ul>
          <li>Optimal watering schedule based on plant type and weather</li>
          <li>Feeding frequency and fertilizer recommendations</li>
          <li>Sun/shade requirements and placement tips</li>
          <li>Interesting facts and care tips specific to your plant</li>
          <li>Expected mature size and growth patterns</li>
        </ul>
      </div>
    </div>
  );
};

export default AddPlantForm;