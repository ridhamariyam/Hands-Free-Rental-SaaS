import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [kycFile, setKycFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setKycFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      if (kycFile) formData.append('kyc_document', kycFile);
      const response = await axios.post('auth/login/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data && response.data.token) {
        login(username, password); // Optionally pass token
        localStorage.setItem('token', response.data.token);
        window.location.href = '/properties';
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
