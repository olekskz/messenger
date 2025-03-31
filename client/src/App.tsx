import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/mainPage';
import './styles/global.css';


function App() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
