import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Inventory } from '@/pages/Inventory';
import { POS } from '@/pages/POS';
import { Store } from '@/pages/Store';
import { Customers } from '@/pages/Customers';
import { Settings } from '@/pages/Settings';
import { Analytics } from '@/pages/Analytics';
import { Prescriptions } from '@/pages/Prescriptions';
import { Suppliers } from '@/pages/Suppliers';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={
            <PageWrapper><Store /></PageWrapper>
          } />
        </Route>

        <Route path="/login" element={
          <PageWrapper><Login /></PageWrapper>
        } />
        
        {/* Admin Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/inventory" element={<PageWrapper><Inventory /></PageWrapper>} />
          <Route path="/pos" element={<PageWrapper><POS /></PageWrapper>} />
          <Route path="/analytics" element={<PageWrapper><Analytics /></PageWrapper>} />
          <Route path="/prescriptions" element={<PageWrapper><Prescriptions /></PageWrapper>} />
          <Route path="/suppliers" element={<PageWrapper><Suppliers /></PageWrapper>} />
          <Route path="/customers" element={<PageWrapper><Customers /></PageWrapper>} />
          <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="h-full w-full"
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <BrowserRouter basename="/demos/farma-sys">
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
