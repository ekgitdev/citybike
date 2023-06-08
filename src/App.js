import './App.css';
import React from 'react';
import CityBikeMap from './CityBikeMap';


const App = () => {
  return (
    <div  className="App">
       <header className="App-header"> Oslo Bysykkel </header>
      <CityBikeMap />
    </div>
  );
};

export default App;
