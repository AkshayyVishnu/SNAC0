import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import RoutePanel from './RoutePanel';
import NavigationPanel from './NavigationPanel';
import PlaceCategorizer from './PlaceCategorizer';
import PlaceDetails from './PlaceDetails';
import '../App.css';

const UserPage = ({ user, onLogout }) => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [navigationRoute, setNavigationRoute] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          <span className="user-info">Logged in as: {user.username}</span>
          <button 
            className="logout-btn"
            onClick={onLogout}
            style={{
              marginLeft: '10px',
              padding: '0.5rem 1rem',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
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
            isAdmin={false}
          />
          <RoutePanel
            isOpen={true}
            routes={routes}
            selectedRoute={selectedRoute}
            onSelectRoute={setSelectedRoute}
            onRouteCreated={() => {}}
            onRouteDeleted={() => {}}
            onRouteUpdated={() => {}}
            onDrawingModeChange={() => {}}
            onMapClickCallbackChange={() => {}}
            isAdmin={false}
          />
        </div>
        <MapComponent
          routes={routes}
          selectedRoute={selectedRoute}
          onRouteSelect={setSelectedRoute}
          isDrawingMode={false}
          onMapClick={null}
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
};

export default UserPage;

