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
        <Route
          path="/relations"
          element={
            <PlaceholderPage
              title="Relations"
              body="Synastry and chakra resonance between charts."
            />
          }
        />
        <Route
          path="/time"
          element={
            <PlaceholderPage
              title="Time"
              body="Today's transits, moon phase, and time-travel to any date."
            />
          }
        />
        <Route
          path="/profile"
          element={
            <PlaceholderPage
              title="Profile"
              body="Your natal summary and settings live here."
            />
          }
        />
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
