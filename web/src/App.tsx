import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { CalculatorPage } from './pages/CalculatorPage';
import { ComparePage } from './pages/ComparePage';
import { GoodPage } from './pages/GoodPage';
import { HomePage } from './pages/HomePage';
import { MethodologyPage } from './pages/MethodologyPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="good/:id" element={<GoodPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="methodology" element={<MethodologyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
