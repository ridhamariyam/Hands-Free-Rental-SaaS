import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import PropertyList from './pages/PropertyList';
import BookingForm from './pages/BookingForm';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/properties" element={
            <ProtectedRoute>
              <PropertyList />
            </ProtectedRoute>
          } />
          <Route path="/book" element={
            <ProtectedRoute>
              <BookingForm />
            </ProtectedRoute>
          } />
          {/* TODO: Add other protected routes */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
