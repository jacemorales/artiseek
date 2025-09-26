import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.tsx';
import LoginPage from './components/LoginPage.tsx';
import SignupPage from './components/SignupPage.tsx';
import OnboardingPage from './components/OnboardingPage.tsx';
import Dashboard from './components/Dashboard.tsx';
import MyServicesPage from './components/MyServicesPage.tsx';
import MyProjectsPage from './components/MyProjectsPage.tsx';
import ProjectDetailsPage from './components/ProjectDetailsPage.tsx';
import EmailVerificationPage from './components/EmailVerificationPage.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email/:token" element={<EmailVerificationPage />} />

          {/* Private Routes */}
          <Route path="/onboarding" element={<PrivateRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/my-services" element={<PrivateRoute />}>
            <Route path="/my-services" element={<MyServicesPage />} />
          </Route>
          <Route path="/my-projects" element={<PrivateRoute />}>
            <Route path="/my-projects" element={<MyProjectsPage />} />
          </Route>
          <Route path="/projects/:id" element={<PrivateRoute />}>
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
