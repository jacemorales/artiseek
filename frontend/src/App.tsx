import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import OnboardingPage from './components/OnboardingPage';
import Dashboard from './components/Dashboard';
import MyServicesPage from './components/MyServicesPage';
import MyProjectsPage from './components/MyProjectsPage';
import ProjectDetailsPage from './components/ProjectDetailsPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
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
