import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/mainPage';
import './styles/global.css';
import LoginPage from './pages/loginPage/LoginPage';
import RegisterPage from './pages/registerPage/RegisterPage';
import SecureRoute from './hooks/authController';
import AvatarUpload from './pages/avatarPastePage/avatarPaste';



function App() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/main" element={<SecureRoute>
          <MainPage />
        </SecureRoute>} />
        <Route path='/avatar-paste' element={<SecureRoute><AvatarUpload /></SecureRoute>}/>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
