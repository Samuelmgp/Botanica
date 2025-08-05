import React, { useState } from 'react';
import PlantCard from './PlantCard';

const PlantList = ({ plants, updatePlant, deletePlant, markWatered, markFed, weather }) => {
  const [editingPlant, setEditingPlant] = useState(null);

  if (plants.length === 0) {
    return (
      <div className="plant-list">
        <h2>My Plants</h2>
        <div className="empty-state">
          <p>🌱 No plants added yet!</p>
          <p>Click "Add Plant" to get started with your plant care journey.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plant-list">
      <h2>My Plants ({plants.length})</h2>
      <div className="plants-grid">
        {plants.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onEdit={() => setEditingPlant(plant)}
            onDelete={() => deletePlant(plant.id)}
            onMarkWatered={() => markWatered(plant.id)}
            onMarkFed={() => markFed(plant.id)}
            isEditing={editingPlant?.id === plant.id}
            onSaveEdit={(updatedPlant) => {
              updatePlant(updatedPlant);
              setEditingPlant(null);
            }}
            onCancelEdit={() => setEditingPlant(null)}
            weather={weather}
          />
        ))}
      </div>
    </div>
  );
};

export default PlantList;