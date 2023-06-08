const express = require('express');
const path = require('path');
const axios = require('axios');


const app = express();
const port = process.env.PORT || 5000;
const baseUrl =  "https://gbfs.urbansharing.com/oslobysykkel.no"

app.use(express.static(path.join(__dirname, 'build')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/api/stations', async (req, res) => {
  try {
    const stationsResponse = await axios.get(`${baseUrl}/station_information.json`)
    .then(response => response.data)
    const statusResponse = await axios.get(`${baseUrl}/station_status.json`)
    .then(response => response.data)
    
    const stations = stationsResponse.data.stations;
    const status = statusResponse.data.stations;

    
    const stationsWithStatus = stations.map(station => {
      const stationStatus = status.find(s => s.station_id === station.station_id);
      return { ...station, 
        num_bikes_available: stationStatus.num_bikes_available,
        num_docks_available: stationStatus.num_docks_available
      };
    });

    res.json(stationsWithStatus);
  } catch (error) {
    console.log('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});
