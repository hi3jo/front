import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage/HomePage';
import ChatbotPage from './components/pages/ChatbotPage';
import CommunityPage from './components/pages/CommunityPage';
import Register from './components/pages/LoginPage/Register';
import Login from './components/pages/LoginPage/login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;