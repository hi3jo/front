import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage/HomePage';
import ChatbotPage from './components/pages/ChatbotPage';
import ImagePage from './components/pages/ImagePage';
import CommunityPage from './components/pages/CommunityPage';
import Register from './components/pages/LoginPage/RegisterUser';
import RegisterLawyer from './components/pages/LoginPage/RegisterLawyer';
import Login from './components/pages/LoginPage/login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/image" element={<ImagePage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-lawyer" element={<RegisterLawyer />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;