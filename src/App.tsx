import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import FindCompanionPage from './pages/FindCompanionPage';
import ProfilePage from './pages/ProfilePage';
import MatchDetailsPage from './pages/MatchDetailsPage';
import EmergencyPage from './pages/EmergencyPage';
import ChatPage from './pages/ChatPage';
import ReviewsPage from './pages/ReviewsPage';
import GroupsPage from './pages/GroupsPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/find-companion" replace />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/find-companion" element={
              <ProtectedRoute>
                <Layout>
                  <FindCompanionPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/match/:id" element={
              <ProtectedRoute>
                <Layout>
                  <MatchDetailsPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/emergency" element={
              <ProtectedRoute>
                <Layout>
                  <EmergencyPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/chat/:chatId" element={
              <ProtectedRoute>
                <Layout>
                  <ChatPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/reviews" element={
              <ProtectedRoute>
                <Layout>
                  <ReviewsPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/groups" element={
              <ProtectedRoute>
                <Layout>
                  <GroupsPage />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Matches List - for now reusing FindCompanionPage or could be a separate list if specific requirements existed. 
                The prompt said "Dashboard... Display a list". FindCompanionPage does this.
                Let's redirect /matches to /find-companion for now or keep it as placeholder if different.
                Actually, let's make /matches show the same list or a filtered list of "Matched" status.
                For simplicity, let's redirect to FindCompanionPage.
            */}
            <Route path="/matches" element={
              <ProtectedRoute>
                <Layout>
                  <FindCompanionPage />
                </Layout>
              </ProtectedRoute>
            } />

          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
