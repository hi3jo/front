import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage/HomePage';
import ChatbotPage from './components/pages/ChatBot/ChatbotPage';
// import ChatbotPage_v2 from './components/pages/Chatbot/ChatbotPage_v2';
// import ChatHistoryPage from './components/pages/Chatbot/ChatHistoryPage';
import ImagePage from './components/pages/ImagePage';
import Register from './components/pages/LoginPage/RegisterUser';
import RegisterLawyer from './components/pages/LoginPage/RegisterLawyer';
import Login from './components/pages/LoginPage/login';
import Post from './components/pages/Post/PostList'
import CreatePost from './components/pages/Post/CreatePost';
import PostDetail from './components/pages/Post/PostDetails';
import UpdatePost from './components/pages/Post/UpdatePost';
import PopularPosts from './components/pages/Post/PopularPosts';
import ImageAnalysis from './components/pages/ImageAnalysis';
import LawyerConsultationPage from './components/pages/LawyerConsulting/LawyerConsultationPage';
import LawyerProfile from './components/pages/LawyerConsulting/LawyerProfile';
import Caselowmanagement from './components/pages/Caselowmanagement';


const AppRoutes = () => {
  // chatHistory와 setChatHistory 상태를 상위 컴포넌트에서 관리
  const [chatHistory, setChatHistory] = useState<{ user: string, ai: string }[]>([]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      {/* <Route path="/chatbot" element={<ChatbotPage_v2 chatHistory={chatHistory} setChatHistory={setChatHistory} />} /> */}
      {/* <Route path="/history" element={<ChatHistoryPage chatHistory={chatHistory} setChatHistory={setChatHistory} />} /> */}
      <Route path="/image" element={<ImagePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-lawyer" element={<RegisterLawyer />} />
      <Route path="/login" element={<Login />} />
      <Route path="/post" element={<Post />} />
      <Route path="/createpost" element={<CreatePost />} />
      <Route path="/popularposts" element={<PopularPosts />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/posts/update/:id" element={<UpdatePost />} />
      <Route path="/imageAnalysis" element={<ImageAnalysis />} />
      <Route path="/lawyer/consultation-request" element={<LawyerConsultationPage />} />
      <Route path="/lawyer/lawyerprofile/:id" element={<LawyerProfile />} />
      <Route path='caselowmanagement' element={<Caselowmanagement />} />
    </Routes>
  );
};

export default AppRoutes;
