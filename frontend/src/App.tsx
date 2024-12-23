import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/sign-in/SignIn';
import { Container } from '@mui/system';
import Dashboard from './pages/dashboard/Dashboard';
import MainGrid from './pages/dashboard/components/home/MainGrid';
import Messages from './pages/dashboard/components/messages/Messages';
import SignUp from './pages/sign-up/SignUp';
import Market from './pages/dashboard/components/market/Market';
import ProtectedRoute from './hooks/authentication/ProtectedRoutes';
import MyCars from './pages/dashboard/components/car/MyCars';

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
