import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Services = () => {
  const { token } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [propertyId, setPropertyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('services/', {
        headers: { Authorization: `Bearer ${token}` },
        params: propertyId ? { property: propertyId } : {},
      });
      setServices(response.data);
    } catch (err) {
      setError('Failed to fetch services');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, [propertyId, token]);

  return (
    <div className="services-container">
      <h2>Service Directory</h2>
      <input
        type="text"
        placeholder="Property ID (optional)"
        value={propertyId}
        onChange={e => setPropertyId(e.target.value)}
      />
      <button onClick={fetchServices} disabled={loading}>Fetch Services</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {services.map(service => (
          <li key={service.id}>
            <strong>{service.service_type}</strong> by {service.vendor} <br />
            Contact: {service.contact_info}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
