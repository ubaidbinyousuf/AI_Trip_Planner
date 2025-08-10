import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
}; 

function Map({ center }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDM33K_rWN854grB7o3CmD1VPUnFUjIZ7U', // Use your actual API key here

  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {/* Add marker later if needed */}
    </GoogleMap>
  );
}

export default Map;
