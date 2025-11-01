import React, { useState, useEffect, useRef } from 'react';
import './NavigationPanel.css';

const NavigationPanel = ({ onRouteCalculate, onClear }) => {
  const [startLocation, setStartLocation] = useState({ name: '', lng: null, lat: null });
  const [endLocation, setEndLocation] = useState({ name: '', lng: null, lat: null });
  const [profile, setProfile] = useState('driving'); // driving, walking, cycling
  const [isSettingStart, setIsSettingStart] = useState(false);
  const [isSettingEnd, setIsSettingEnd] = useState(false);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [places, setPlaces] = useState([]); // Local college places from database
  const searchTimeoutRef = useRef({ start: null, end: null });

  const handleCalculateRoute = () => {
    if (!startLocation.lng || !startLocation.lat || !endLocation.lng || !endLocation.lat) {
      alert('Please set both start and end locations');
      return;
    }

    onRouteCalculate({
      start: { ...startLocation },
      end: { ...endLocation },
      profile: profile
    });
  };

  const handleClear = () => {
    setStartLocation({ name: '', lng: null, lat: null });
    setEndLocation({ name: '', lng: null, lat: null });
    onClear();
  };

  const handleSetFromMap = (type) => {
    if (type === 'start') {
      setIsSettingStart(true);
      setIsSettingEnd(false);
      window.setNavLocationType = 'start';
    } else {
      setIsSettingEnd(true);
      setIsSettingStart(false);
      window.setNavLocationType = 'end';
    }
  };

  useEffect(() => {
    fetchPlaces();
    const interval = setInterval(() => {
      fetchPlaces();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (startSuggestions.length > 0) {
      setShowStartSuggestions(true);
    }
  }, [startSuggestions]);

  useEffect(() => {
    if (endSuggestions.length > 0) {
      setShowEndSuggestions(true);
    }
  }, [endSuggestions]);

  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/places`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const placesArray = Array.isArray(data) ? data : [];
      setPlaces(placesArray);
    } catch (error) {
      console.error('Error fetching places:', error);
      setPlaces([]);
    }
  };

  React.useEffect(() => {
    window.setNavLocation = (lng, lat, name = '') => {
      const type = window.setNavLocationType;
      
      if (type === 'start') {
        setStartLocation({ name: name || 'Start Location', lng, lat });
        setIsSettingStart(false);
      } else if (type === 'end') {
        setEndLocation({ name: name || 'End Location', lng, lat });
        setIsSettingEnd(false);
      }
      
      window.setNavLocationType = null;
    };
    
    return () => {
      window.setNavLocation = null;
      window.setNavLocationType = null;
      if (searchTimeoutRef.current.start) clearTimeout(searchTimeoutRef.current.start);
      if (searchTimeoutRef.current.end) clearTimeout(searchTimeoutRef.current.end);
    };
  }, []);

  const handleLocationSearch = async (type, query) => {
    if (!query || query.trim().length === 0) {
      if (places.length === 0) {
        fetchPlaces();
      }
      
      const allLocalPlaces = places.slice(0, 20).map(place => ({
        name: place.name,
        lng: place.longitude,
        lat: place.latitude,
        context: place.category ? `🏫 ${place.category.charAt(0).toUpperCase() + place.category.slice(1).replace('_', ' ')}` : 'College Place',
        isLocal: true,
        description: place.description || ''
      }));
      
      if (type === 'start') {
        setStartSuggestions(allLocalPlaces);
        setShowStartSuggestions(allLocalPlaces.length > 0);
      } else {
        setEndSuggestions(allLocalPlaces);
        setShowEndSuggestions(allLocalPlaces.length > 0);
      }
      return;
    }

    const queryLower = query.toLowerCase().trim();
    
    if (queryLower.length < 1) {
      if (type === 'start') {
        setStartSuggestions([]);
        setShowStartSuggestions(false);
      } else {
        setEndSuggestions([]);
        setShowEndSuggestions(false);
      }
      return;
    }

    const allSuggestions = [];
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0);
    
    const localPlaceMatches = places.filter(place => {
      const nameLower = (place.name || '').toLowerCase();
      const descLower = (place.description || '').toLowerCase();
      const categoryLower = (place.category || '').toLowerCase().replace('_', ' ');
      
      const allWordsMatch = queryWords.every(word => 
        nameLower.includes(word) || 
        descLower.includes(word) || 
        categoryLower.includes(word)
      );
      
      const exactMatch = nameLower.includes(queryLower) || 
                        descLower.includes(queryLower) ||
                        categoryLower.includes(queryLower);
      
      const nameWords = nameLower.split(/\s+/);
      const wordMatch = queryWords.some(word => {
        return nameWords.some(nw => nw.startsWith(word) || nw.includes(word));
      });
      
      const fuzzyMatch = queryLower.length >= 3 && nameWords.some(nw => 
        nw.substring(0, queryLower.length) === queryLower ||
        nw.includes(queryLower.substring(0, Math.max(2, queryLower.length - 1)))
      );
      
      return allWordsMatch || exactMatch || wordMatch || fuzzyMatch;
    });
    
    let placesToShow = localPlaceMatches;
    let isShowingAll = false;
    if (placesToShow.length === 0 && queryLower.length <= 3 && places.length > 0) {
      placesToShow = places.slice(0, 15);
      isShowingAll = true;
    }
    
    const mappedMatches = placesToShow.map(place => ({
      name: place.name,
      lng: place.longitude,
      lat: place.latitude,
      context: place.category ? `🏫 ${place.category.charAt(0).toUpperCase() + place.category.slice(1).replace('_', ' ')}` : 'College Place',
      isLocal: true,
      description: place.description || '',
      relevance: calculateRelevance(place, queryLower, queryWords)
    }));
    
    const sortedMatches = mappedMatches
      .sort((a, b) => {
        if (queryLower.length === 0 || isShowingAll) {
          return a.name.localeCompare(b.name);
        }
        return b.relevance - a.relevance;
      })
      .slice(0, 15);

    allSuggestions.push(...sortedMatches);

    if (type === 'start') {
      setStartSuggestions(allSuggestions);
      if (allSuggestions.length > 0) {
        setShowStartSuggestions(true);
      } else {
        setShowStartSuggestions(false);
      }
    } else {
      setEndSuggestions(allSuggestions);
      if (allSuggestions.length > 0) {
        setShowEndSuggestions(true);
      } else {
        setShowEndSuggestions(false);
      }
    }
  };

  const calculateRelevance = (place, queryLower, queryWords) => {
    const nameLower = (place.name || '').toLowerCase();
    const descLower = (place.description || '').toLowerCase();
    let score = 0;
    
    if (nameLower === queryLower) score += 100;
    else if (nameLower.startsWith(queryLower)) score += 50;
    else if (nameLower.includes(queryLower)) score += 30;
    
    queryWords.forEach(word => {
      const nameWords = nameLower.split(/\s+/);
      if (nameWords.some(nw => nw === word)) score += 20;
      else if (nameWords.some(nw => nw.startsWith(word))) score += 15;
      else if (nameWords.some(nw => nw.includes(word))) score += 10;
    });
    
    if (descLower.includes(queryLower)) score += 5;
    
    return score;
  };

  const handleSelectSuggestion = (type, suggestion) => {
    const location = {
      name: suggestion.name,
      lng: suggestion.lng,
      lat: suggestion.lat
    };
    
    if (type === 'start') {
      setStartLocation(location);
      setShowStartSuggestions(false);
      setStartSuggestions([]);
    } else {
      setEndLocation(location);
      setShowEndSuggestions(false);
      setEndSuggestions([]);
    }
  };

  return (
    <div className="navigation-panel">
      <h3>📍 Navigation</h3>
      
      <div className="nav-form">
        <div className="nav-input-group">
          <label>Start Location</label>
          <div className="nav-input-row" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search or click on map..."
              value={startLocation.name}
              onChange={(e) => {
                const val = e.target.value;
                // Update state immediately for responsive typing
                setStartLocation(prev => ({ ...prev, name: val }));
                
                // Clear previous timeout
                if (searchTimeoutRef.current.start) {
                  clearTimeout(searchTimeoutRef.current.start);
                }
                
                // Debounce search - search after user stops typing (300ms delay)
                searchTimeoutRef.current.start = setTimeout(() => {
                  handleLocationSearch('start', val);
                }, 300);
              }}
              onFocus={(e) => {
                // Show all places when focusing on empty input
                if (!startLocation.name.trim()) {
                  handleLocationSearch('start', '');
                } else {
                  // If there's already text, search with it
                  handleLocationSearch('start', startLocation.name);
                }
                // Show suggestions if we have any
                setTimeout(() => {
                  if (startSuggestions.length > 0) {
                    setShowStartSuggestions(true);
                  }
                }, 100);
              }}
              onBlur={() => {
                // Delay to allow suggestion click
                setTimeout(() => {
                  setShowStartSuggestions(false);
                }, 250);
              }}
            />
            <button
              className={`btn-set-location ${isSettingStart ? 'active' : ''}`}
              onClick={() => handleSetFromMap('start')}
              title="Click on map to set start"
            >
              🖱️
            </button>
            {showStartSuggestions && startSuggestions.length > 0 && (
              <div className="suggestions-dropdown" style={{ zIndex: 1000 }}>
                {startSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className={`suggestion-item ${suggestion.isLocal ? 'local-place' : ''}`}
                    onClick={() => handleSelectSuggestion('start', suggestion)}
                  >
                    <div className="suggestion-name">
                      {suggestion.isLocal && '🏫 '}
                      {suggestion.name}
                    </div>
                    {suggestion.context && (
                      <div className="suggestion-context">{suggestion.context}</div>
                    )}
                    {suggestion.description && (
                      <div className="suggestion-desc">{suggestion.description.substring(0, 60)}...</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {startLocation.lng && (
            <div className="location-coords">
              {startLocation.lat.toFixed(4)}, {startLocation.lng.toFixed(4)}
            </div>
          )}
        </div>

        <div className="nav-input-group">
          <label>End Location</label>
          <div className="nav-input-row" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search or click on map..."
              value={endLocation.name}
              onChange={(e) => {
                const val = e.target.value;
                // Update state immediately for responsive typing
                setEndLocation(prev => ({ ...prev, name: val }));
                
                // Clear previous timeout
                if (searchTimeoutRef.current.end) {
                  clearTimeout(searchTimeoutRef.current.end);
                }
                
                // Debounce search - search after user stops typing (300ms delay)
                searchTimeoutRef.current.end = setTimeout(() => {
                  handleLocationSearch('end', val);
                }, 300);
              }}
              onFocus={(e) => {
                // Show all places when focusing on empty input
                if (!endLocation.name.trim()) {
                  handleLocationSearch('end', '');
                } else {
                  // If there's already text, search with it
                  handleLocationSearch('end', endLocation.name);
                }
                // Show suggestions if we have any
                setTimeout(() => {
                  if (endSuggestions.length > 0) {
                    setShowEndSuggestions(true);
                  }
                }, 100);
              }}
              onBlur={() => {
                // Delay to allow suggestion click
                setTimeout(() => {
                  setShowEndSuggestions(false);
                }, 250);
              }}
            />
            <button
              className={`btn-set-location ${isSettingEnd ? 'active' : ''}`}
              onClick={() => handleSetFromMap('end')}
              title="Click on map to set end"
            >
              🖱️
            </button>
            {showEndSuggestions && endSuggestions.length > 0 && (
              <div className="suggestions-dropdown" style={{ zIndex: 1000 }}>
                {endSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className={`suggestion-item ${suggestion.isLocal ? 'local-place' : ''}`}
                    onClick={() => handleSelectSuggestion('end', suggestion)}
                  >
                    <div className="suggestion-name">
                      {suggestion.isLocal && '🏫 '}
                      {suggestion.name}
                    </div>
                    {suggestion.context && (
                      <div className="suggestion-context">{suggestion.context}</div>
                    )}
                    {suggestion.description && (
                      <div className="suggestion-desc">{suggestion.description.substring(0, 60)}...</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {endLocation.lng && (
            <div className="location-coords">
              {endLocation.lat.toFixed(4)}, {endLocation.lng.toFixed(4)}
            </div>
          )}
        </div>

        <div className="nav-input-group">
          <label>Travel Mode</label>
          <select value={profile} onChange={(e) => setProfile(e.target.value)}>
            <option value="driving">🚗 Driving</option>
            <option value="walking">🚶 Walking</option>
            <option value="cycling">🚴 Cycling</option>
          </select>
        </div>

        <div className="nav-actions">
          <button className="btn-calculate" onClick={handleCalculateRoute}>
            Get Directions
          </button>
          <button className="btn-clear" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;

