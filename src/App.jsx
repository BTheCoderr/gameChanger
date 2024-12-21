import { useState } from 'react';
import MainLayout from './components/MainLayout';

function App() {
  const [activeLayers, setActiveLayers] = useState({
    leads: false,
    neighborhoodInsights: false,
    utilityBoundaries: false,
    solarPermits: false,
    moveIns: false,
    cityBoundaries: false,
    spanishSpeakers: false,
    manufacturedHomes: false,
    evOwners: false,
    aerial: false
  });

  const handleLayerToggle = (layerName) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  return (
    <MainLayout 
      activeLayers={activeLayers} 
      onLayerToggle={handleLayerToggle}
    />
  );
}

export default App;
