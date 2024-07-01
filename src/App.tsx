import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from './components/inc/Navbar';
import Footer from './components/inc/Footer';
import AppRoutes from './routes';
import { AuthProvider } from './components/services/auth';

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <div>
          <Helmet>
            <link href="https://fonts.googleapis.com/css2?family=Jua&display=swap" rel="stylesheet" />
          </Helmet>
          <Navbar />
          <AppRoutes />
          <Footer />
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
