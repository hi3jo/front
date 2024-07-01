// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './components/user/Home';
// import SexCrimes from './components/user/SexCrimes';
// import Divorce from './components/user/Divorce';
// import NotFound from './components/user/NotFound';
// import Layout from './components/inc/Layout';

// const App = () => {
//   return (
//     <Layout>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/sex-crimes" element={<SexCrimes />} />
//         <Route path="/divorce" element={<Divorce />} />
//         <Route path="*" element={<NotFound />} />
//         </Routes>
//     </Layout>
//   );
// };

// export default App;

import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from './components/inc/Navbar';
import Footer from './components/inc/Footer';
import AppRoutes from './routes';

const App = () => {
  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <link href="https://fonts.googleapis.com/css2?family=Jua&display=swap" rel="stylesheet" />
        </Helmet>
        <Navbar />
        <AppRoutes />
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default App;
