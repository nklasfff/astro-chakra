import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import AppShell from './components/layout/AppShell';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import HomePage from './pages/HomePage';
import PlaceholderPage from './pages/PlaceholderPage';
import ChakraDeepPage from './pages/ChakraDeepPage';
import ExplorePage from './pages/ExplorePage';
import NatalChartPage from './pages/NatalChartPage';
import TimePage from './pages/TimePage';
import ProfilePage from './pages/ProfilePage';
import JournalPage from './pages/JournalPage';
import RelationsPage from './pages/RelationsPage';
import JourneyPage from './pages/JourneyPage';
import MovementPage from './pages/MovementPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  const { isOnboarded } = useUser();

  if (!isOnboarded) {
    return <OnboardingFlow />;
  }

  return (
    <Routes>
      <Route element={<><ScrollToTop /><AppShell /></>}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/chakras/:chakraId" element={<ChakraDeepPage />} />
        <Route path="/explore/natal" element={<NatalChartPage />} />
        <Route path="/explore/journal" element={<JournalPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/movement" element={<MovementPage />} />
        {/* Legacy routes still resolve for deep links */}
        <Route path="/relations" element={<RelationsPage />} />
        <Route path="/time" element={<TimePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </HashRouter>
  );
}
