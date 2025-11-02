import React, { useState, useEffect } from 'react';
import PlaceForm from './PlaceForm';
import './PlaceCategorizer.css';

const PlaceCategorizer = ({ onPlaceSelect }) => {
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCollectingPlaces, setIsCollectingPlaces] = useState(false);
  const [collectedPlaces, setCollectedPlaces] = useState([]);

  const categories = {
    all: { label: '📍 All Places', icon: '📍' },
    eateries: { label: '🍽️ Eateries', icon: '🍽️' },
    recreation: { label: '⚽ Recreation', icon: '⚽' },
    educational: { label: '📚 Educational', icon: '📚' },
    administration: { label: '🏛️ Administration', icon: '🏛️' },
    staff_quarters: { label: '🏠 Staff Quarters', icon: '🏠' },
    hostel: { label: '🏘️ Hostel', icon: '🏘️' },
    library: { label: '📖 Library', icon: '📖' },
    other: { label: ' Other', icon: '' }
  };

  useEffect(() => {
    fetchPlaces();
  }, [selectedCategory]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const url = selectedCategory && selectedCategory !== 'all'
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/places/category/${selectedCategory}`
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/places`;
      
      const response = await fetch(url);
      const data = await response.json();
      setPlaces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching places:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };


  const handleStartCollectingPlaces = () => {
    if (!window.confirm('Click on places visible on the map to collect them.\n\nA prompt will ask you to enter the place name.\nClick "Save Collected Places" when done.')) {
      return;
    }
    
    setIsCollectingPlaces(true);
    setCollectedPlaces([]);
    window.isCollectingPlaces = true;
    window.collectPlaceCallback = (placeData) => {
      setCollectedPlaces(prev => {
        // Check if place already collected (by coordinates or name)
        const existsByCoords = prev.some(p => 
          Math.abs(p.latitude - placeData.latitude) < 0.0001 && 
          Math.abs(p.longitude - placeData.longitude) < 0.0001
        );
        const existsByName = prev.some(p => 
          p.name.toLowerCase().trim() === placeData.name.toLowerCase().trim()
        );
        
        if (!existsByCoords && !existsByName) {
          // Update UI to show new place collected
          return [...prev, placeData];
        } else if (existsByName) {
          alert(`⚠️ Place "${placeData.name}" already collected.`);
          return prev;
        } else {
          return prev;
        }
      });
    };
  };

  const handleStopCollectingPlaces = () => {
    setIsCollectingPlaces(false);
    window.isCollectingPlaces = false;
    window.collectPlaceCallback = null;
  };

  const handleSaveCollectedPlaces = async () => {
    if (collectedPlaces.length === 0) {
      alert('No places collected yet. Click on places on the map first.');
      return;
    }

    if (!window.confirm(`Save ${collectedPlaces.length} collected places to database?`)) {
      return;
    }

    setIsSaving(true);
    try {
      // Let user edit names and categories before saving
      const placesToSave = collectedPlaces.map(place => ({
        name: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        category: 'other', // Default category, user can edit later
        description: 'Collected from map'
      }));

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/places/bulk-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ places: placesToSave })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`✅ Saved ${data.results.success.length} places!\n\nCreated: ${data.results.success.length}\nFailed: ${data.results.failed.length}\nSkipped: ${data.results.skipped.length}`);
        setCollectedPlaces([]);
        handleStopCollectingPlaces();
        fetchPlaces(); // Refresh the places list
      } else {
        alert(`Error: ${data.error || 'Failed to save places'}`);
      }
    } catch (error) {
      console.error('Error saving collected places:', error);
      alert('Error saving places. Please check the console.');
    } finally {
      setIsSaving(false);
    }
  };

  const groupedPlaces = places.reduce((acc, place) => {
    const category = place.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(place);
    return acc;
  }, {});

  if (editingPlace) {
    return (
      <div className="place-categorizer">
        <div className="categorizer-header">
          <h3>Edit Place</h3>
          <button onClick={() => { setEditingPlace(null); }}>✕</button>
        </div>
        <PlaceForm
          place={editingPlace}
          onSave={() => {
            setEditingPlace(null);
            fetchPlaces();
          }}
          onCancel={() => { setEditingPlace(null); }}
        />
      </div>
    );
  }

  return (
    <div className="place-categorizer">
      <div className="categorizer-header">
        <h3>🗺️ Places</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {!isCollectingPlaces ? (
            <button 
              onClick={handleStartCollectingPlaces}
              className="collect-btn"
              title="Click on places on the map to collect them"
            >
              📍 Collect from Map
            </button>
          ) : (
            <>
              <button 
                onClick={handleSaveCollectedPlaces}
                disabled={isSaving || collectedPlaces.length === 0}
                style={{
                  padding: '0.5rem 1rem',
                  background: isSaving || collectedPlaces.length === 0 ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isSaving || collectedPlaces.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
                title={`Save ${collectedPlaces.length} collected places`}
              >
                {isSaving ? '⏳ Saving...' : `💾 Save Collected (${collectedPlaces.length})`}
              </button>
              <button 
                onClick={handleStopCollectingPlaces}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                ✕ Stop Collecting
              </button>
            </>
          )}
        </div>
        {isCollectingPlaces && (
          <div style={{
            padding: '0.75rem',
            margin: '0.5rem 0',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '6px',
            fontSize: '0.875rem'
          }}>
            <strong>📍 Collection Mode Active!</strong><br/>
            Click on places visible on the map, then enter their name in the prompt.
            {collectedPlaces.length > 0 && (
              <>
                <br/><strong>Collected: {collectedPlaces.length} place{collectedPlaces.length !== 1 ? 's' : ''}</strong>
                <div style={{ marginTop: '0.5rem', maxHeight: '150px', overflowY: 'auto', fontSize: '0.8rem' }}>
                  {collectedPlaces.map((place, idx) => (
                    <div key={idx} style={{ padding: '0.25rem 0', borderBottom: '1px solid #ffc107' }}>
                      {idx + 1}. {place.name}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="category-filter">
        <div className="category-buttons">
          {Object.entries(categories).map(([key, { label, icon }]) => (
            <button
              key={key}
              className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(key)}
            >
              {icon} {label.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading">Loading places...</div>}

      <div className="places-list">
        {selectedCategory && selectedCategory !== 'all' ? (
          groupedPlaces[selectedCategory]?.length > 0 ? (
            groupedPlaces[selectedCategory].map((place) => (
                <div key={place._id} className="place-item">
                  <div
                    className="place-item-content"
                    onClick={() => onPlaceSelect(place)}
                  >
                    <div className="place-item-header">
                      <span className="place-icon">{categories[place.category]?.icon || '📍'}</span>
                      <span className="place-name">{place.name}</span>
                    </div>
                    {place.description && (
                      <div className="place-item-desc">{place.description.substring(0, 50)}...</div>
                    )}
                  </div>
                  <button
                    className="place-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPlace(place);
                    }}
                    title="Edit place"
                  >
                    ✏️
                  </button>
                </div>
            ))
          ) : (
            <div className="empty-state">No places in this category</div>
          )
        ) : (
          Object.entries(groupedPlaces).map(([category, categoryPlaces]) => (
            <div key={category} className="category-group">
              <div className="category-group-header">
                <span className="category-icon">{categories[category]?.icon || '📍'}</span>
                <span className="category-name">{categories[category]?.label || category}</span>
                <span className="category-count">({categoryPlaces.length})</span>
              </div>
              <div className="category-places">
                {categoryPlaces.map((place) => (
                  <div key={place._id} className="place-item">
                    <div
                      className="place-item-content"
                      onClick={() => onPlaceSelect(place)}
                    >
                      <span className="place-name">{place.name}</span>
                      {place.description && (
                        <div className="place-item-desc">{place.description.substring(0, 40)}...</div>
                      )}
                    </div>
                    <button
                      className="place-edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPlace(place);
                      }}
                      title="Edit place"
                    >
                      ✏️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {places.length === 0 && !loading && (
        <div className="empty-state">
          <p>No places found</p>
          <p className="hint">Add places to see them here</p>
        </div>
      )}
    </div>
  );
};

export default PlaceCategorizer;

