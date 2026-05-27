import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { motion } from 'framer-motion';

export const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        {/* Glow effect in background for industrial premium feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <Topbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto z-0 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};
