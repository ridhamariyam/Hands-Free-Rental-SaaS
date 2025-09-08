import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const PropertyList = () => {
  const { token } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('properties/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperties(response.data);
      } catch (err) {
        setError('Failed to fetch properties');
      }
      setLoading(false);
    };
    fetchProperties();
  }, [token]);

  return (
    <div className="property-list-container">
      <h2>Properties</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            <strong>{property.name}</strong><br />
            {property.address}<br />
            {property.description}
            {/* TODO: Link to units, booking, etc. */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
