import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage/HomePage';
import ChatbotPage from './components/pages/ChatbotPage';
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


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
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
    </Routes>
  );
};

export default AppRoutes;