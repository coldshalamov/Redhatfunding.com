// src/App.tsx (or wherever this file lives)
import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import { logAnalyticsEvent } from "@/lib/analytics";

// Lazy routes
const Home = lazy(() => import("@/routes/Home"));
const Apply = lazy(() => import("@/routes/Apply"));
const Admin = lazy(() => import("@/routes/Admin"));
const Privacy = lazy(() => import("@/routes/Privacy"));
const Terms = lazy(() => import("@/routes/Terms"));

const App = () => {
  const location = useLocation();

  useEffect(() => {
    logAnalyticsEvent("route_change", { pathname: location.pathname });
  }, [location.pathname]);

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-[#f6f8fb]">
        <Navbar />
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="flex justify-center p-8 text-sm text-slate-500">
                Loading...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
};

export default App;
