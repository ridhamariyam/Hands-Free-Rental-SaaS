import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import PropertyList from './pages/PropertyList';
import BookingForm from './pages/BookingForm';
import UnitDetails from './pages/UnitDetails';
import Tickets from './pages/Tickets';
import Services from './pages/Services';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function ProtectedRoute({ children, allowedRoles }) {
  const { token, role } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" />;
  return children;
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/properties" element={
            // <ProtectedRoute allowedRoles={['tenant', 'landlord']}>
              <PropertyList />
            // </ProtectedRoute>
          } />
          <Route path="/book" element={
            // <ProtectedRoute allowedRoles={['tenant']}>
              <BookingForm />
            // </ProtectedRoute>
          } />
          <Route path="/units/:unitId" element={
            // <ProtectedRoute allowedRoles={['tenant', 'landlord']}>
              <UnitDetails />
            // </ProtectedRoute>
          } />
          <Route path="/tickets" element={
            // <ProtectedRoute allowedRoles={['tenant']}>
              <Tickets />
            // </ProtectedRoute>
          } />
          <Route path="/services" element={
            // <ProtectedRoute allowedRoles={['tenant', 'landlord']}>
              <Services />
            // </ProtectedRoute>
          } />
          {/* TODO: Add other protected routes */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
