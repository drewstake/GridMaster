// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import GridMaster from "./components/GridMaster";
import './App.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/game/:gameId" element={<GridMaster />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
);

export default App;