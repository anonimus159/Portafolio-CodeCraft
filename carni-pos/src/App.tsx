import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { Layout, PageWrapper } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { CutsAndYield } from './pages/CutsAndYield';
import { Inventory } from './pages/Inventory';
import { Refrigeration } from './pages/Refrigeration';
import { Customers } from './pages/Customers';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/pos" element={<PageWrapper><POS /></PageWrapper>} />
          <Route path="/cuts" element={<PageWrapper><CutsAndYield /></PageWrapper>} />
          <Route path="/inventory" element={<PageWrapper><Inventory /></PageWrapper>} />
          <Route path="/refrigeration" element={<PageWrapper><Refrigeration /></PageWrapper>} />
          <Route path="/customers" element={<PageWrapper><Customers /></PageWrapper>} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router basename="/demos/carni-pos">
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
