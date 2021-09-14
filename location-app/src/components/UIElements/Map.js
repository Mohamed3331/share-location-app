import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

import './Map.css';

const Map = props => {

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibW9oYW1lZDMzMSIsImEiOiJjazBzZ3NnczgwMmh1M2pwN2Fvd3Nmdmh3In0.Qx3Ex0yWDq9_nGhtlhErUw';
        var map = new mapboxgl.Map({
          container: 'mapping',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: props.coordinates,
          zoom: 7
        });

        new mapboxgl.Marker()
        .setLngLat(props.coordinates)
        .addTo(map); 
    }, [props.coordinates])

  return (
    <div id="mapping">
    
    </div>
  );
};

export default Map;
