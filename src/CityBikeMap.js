import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const CityBikeMap = () => {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchStations = async () => {
    try {
      const response = await axios.get('/api/stations'); 
      setStations(response.data);
      setIsLoading(false);
   
    } catch (error) {
      console.log('Error fetching stations:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
    
    const updateInterval = setInterval(fetchStations, 10000);

    return () => {
      clearInterval(updateInterval);
    };
   
  }, []);

  const getStationColor = (availableBikes, capacity) => {
    const availability = availableBikes / capacity;
    if (availability === 0) 
      return "#ffffff";
    else if (availability > 0 && availability < 0.2)
      return "#7ac0f5"
    else return "#047bd5"
  };


  if (isLoading)
    return <h2>Laster ned bysykkel kart ...</h2>
  else if(isError)
    return <h2>Kunne ikke laste ned bysykkel kart ...</h2>
  else return (
     <MapContainer
      center={[59.91, 10.75]}
      zoom={13}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map((station) => 
        <Circle
            weight="10"
            color={getStationColor(station.num_bikes_available, station.capacity)}
            key={station.station_id}
            center={[station.lat, station.lon]}
            radius={5}
        >
          <Popup>
            <div><b>Stativ:</b> {station.name}</div>
            <div>
              <b>Ledige sykler: </b> {station.num_bikes_available} / {station.capacity}
            </div>
            <div>
              <b>Tilgjengelige låser:</b> {station.num_docks_available}</div>
            </Popup>
          </Circle>
        )
      }       
    </MapContainer>   
  );
};

export default CityBikeMap;