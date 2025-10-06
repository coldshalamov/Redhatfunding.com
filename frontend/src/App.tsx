import { Route, Routes, useLocation } from 'react-router-dom';
import Home from '@/routes/Home';
import Apply from '@/routes/Apply';
import Admin from '@/routes/Admin';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import { useEffect } from 'react';
import { logAnalyticsEvent } from '@/lib/analytics';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    logAnalyticsEvent('route_change', { pathname: location.pathname });
  }, [location.pathname]);

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-[#f6f8fb]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
};

export default App;
