import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/common/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import CaseQueue from './pages/CaseQueue/CaseQueue';
import CaseDetails from './pages/CaseDetails/CaseDetails';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cases" element={<CaseQueue />} />
          <Route path="/cases/:caseId" element={<CaseDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
