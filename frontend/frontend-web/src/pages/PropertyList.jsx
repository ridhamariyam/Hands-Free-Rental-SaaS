import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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
            <ul>
              {property.units && property.units.map((unit) => (
                <li key={unit.id}>
                  <Link to={`/units/${unit.id}`}>{unit.name}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
