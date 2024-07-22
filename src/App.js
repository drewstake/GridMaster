import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import GridMaster from './components/GridMaster';
import './App.css';

function App() {
  console.log("App component rendered");
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:gameId" element={<GridMaster />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;