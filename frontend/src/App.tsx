import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/authentication/SignIn';
import Dashboard from './pages/dashboard/Dashboard';
import MainGrid from './pages/dashboard/MainGrid';
import Messages from './pages/message/Messages';
import SignUp from './pages/authentication/SignUp';
import Market from './pages/car/Market';
import ProtectedRoute from './hooks/authentication/ProtectedRoutes';
import MyCars from './pages/car/MyCars';
import { Container } from '@mui/material';

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path="/my-cars"
            element={
              <ProtectedRoute>
                <Dashboard mainContent={<MyCars />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Dashboard mainContent={<MainGrid />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <Dashboard mainContent={<Messages />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <Dashboard mainContent={<Market />} />
              </ProtectedRoute>
            }
          />
          <Route path="/login/" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
