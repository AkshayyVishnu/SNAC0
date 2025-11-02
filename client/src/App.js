import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import RoutePanel from './components/RoutePanel';
import NavigationPanel from './components/NavigationPanel';
import PlaceCategorizer from './components/PlaceCategorizer';
import PlaceDetails from './components/PlaceDetails';
import './App.css';

function App() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [isDrawingRoute, setIsDrawingRoute] = useState(false);
  const [onMapClickCallback, setOnMapClickCallback] = useState(null);
  const [navigationRoute, setNavigationRoute] = useState(null);
  const [isSettingNavLocation, setIsSettingNavLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [places, setPlaces] = useState([]);

  // Fetch routes from API
  const fetchRoutes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/routes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRoutes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setRoutes([]);
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/places`);
      const data = await response.json();
      setPlaces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching places:', error);
      setPlaces([]);
    }
  };

  const handleRouteCreated = () => {
    fetchRoutes();
  };

  const handleRouteDeleted = () => {
    fetchRoutes();
    setSelectedRoute(null);
  };

  const handleRouteUpdated = () => {
    fetchRoutes();
  };

  const handleNavigationCalculate = (routeData) => {
    setNavigationRoute(routeData);
  };

  const handleNavigationClear = () => {
    setNavigationRoute(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>SNACO</h1>
        <div className="header-actions">
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            aria-label="Toggle menu"
          >
            <span className="menu-icon">⋯</span>
          </button>
          <button 
            className="toggle-panel-btn"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
          >
            {isPanelOpen ? 'Hide' : 'Show'} Routes
          </button>
        </div>
      </header>
      <div className="app-container">
        {isPanelOpen && isMobile && (
          <div 
            className="sidebar-overlay"
            onClick={() => setIsPanelOpen(false)}
          />
        )}
        <div className={`sidebar-panel ${isPanelOpen ? '' : 'hidden'}`}>
          <NavigationPanel
            onRouteCalculate={handleNavigationCalculate}
            onClear={handleNavigationClear}
          />
          <PlaceCategorizer
            onPlaceSelect={setSelectedPlace}
          />
          <RoutePanel
            isOpen={true}
            routes={routes}
            selectedRoute={selectedRoute}
            onSelectRoute={setSelectedRoute}
            onRouteCreated={handleRouteCreated}
            onRouteDeleted={handleRouteDeleted}
            onRouteUpdated={handleRouteUpdated}
            onDrawingModeChange={setIsDrawingRoute}
            onMapClickCallbackChange={setOnMapClickCallback}
          />
        </div>
        <MapComponent
          routes={routes}
          selectedRoute={selectedRoute}
          onRouteSelect={setSelectedRoute}
          isDrawingMode={isDrawingRoute}
          onMapClick={onMapClickCallback}
          navigationRoute={navigationRoute}
          onNavigationClear={handleNavigationClear}
          places={places}
          onPlaceSelect={setSelectedPlace}
        />
        {selectedPlace && (
          <PlaceDetails
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;

