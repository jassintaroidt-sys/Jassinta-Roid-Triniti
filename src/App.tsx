import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

// Code-split routes with React.lazy
const OnePage = lazy(() => import('./pages/OnePage'));
const StrategyDetail = lazy(() => import('./pages/StrategyDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Minimal elegant loading fallback
const RouteFallback: React.FC = () => (
  <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#0A0A0A] text-[#EFE8D8]">
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-1.5 rounded-full bg-[#D7261E] animate-pulse" />
      <span className="text-micro text-[#EFE8D8]/50 tracking-widest">
        LOADING
      </span>
    </div>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<OnePage />} />
            <Route path="/personal-brand" element={<OnePage />} />
            <Route path="/writing-portfolio" element={<OnePage />} />
            <Route path="/content-marketing-specialist" element={<OnePage />} />
            <Route path="/example-strategy" element={<OnePage />} />
            <Route path="/project-campus" element={<OnePage />} />
            <Route path="/podcast" element={<OnePage />} />
            <Route path="/example-strategy/:type" element={<StrategyDetail />} />
            <Route path="/archive" element={<OnePage />} />
            <Route path="/contact" element={<OnePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
