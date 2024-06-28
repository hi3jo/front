import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/user/Home';
import SexCrimes from './components/user/SexCrimes';
import Divorce from './components/user/Divorce';
import NotFound from './components/user/NotFound';
import Layout from './components/inc/Layout';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sex-crimes" element={<SexCrimes />} />
        <Route path="/divorce" element={<Divorce />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
    </Layout>
  );
};

export default App;
