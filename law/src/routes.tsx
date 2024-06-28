import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import ChatbotPage from './components/pages/ChatbotPage';
import CommunityPage from './components/pages/CommunityPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/community" element={<CommunityPage />} />
    </Routes>
  );
};

export default AppRoutes;