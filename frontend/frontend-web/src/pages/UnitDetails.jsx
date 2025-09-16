import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const UnitDetails = () => {
  const { token } = useContext(AuthContext);
  const { unitId } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState('rent');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUnit = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`units/${unitId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnit(response.data);
      } catch (err) {
        setError('Failed to fetch unit');
      }
      setLoading(false);
    };
    fetchUnit();
  }, [unitId, token]);

  const handleBookUnit = async () => {
    setSuccess('');
    setError('');
    try {
      await axios.post(`units/${unitId}/book/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Unit booked successfully!');
    } catch (err) {
      setError('Booking failed');
    }
  };

  const handlePay = async () => {
    setSuccess('');
    setError('');
    try {
      await axios.post('payments/', {
        unit: unitId,
        amount: paymentAmount,
        payment_type: paymentType,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Payment successful!');
    } catch (err) {
      setError('Payment failed');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!unit) return <p>No unit found.</p>;

  return (
    <div className="unit-details-container">
      <h2>{unit.name}</h2>
      <p>{unit.description}</p>
      <p>Booked: {unit.is_booked ? 'Yes' : 'No'}</p>
      <button onClick={handleBookUnit} disabled={unit.is_booked}>Book Unit</button>
      <h3>Make a Payment</h3>
      <input
        type="number"
        placeholder="Amount"
        value={paymentAmount}
        onChange={e => setPaymentAmount(e.target.value)}
      />
      <select value={paymentType} onChange={e => setPaymentType(e.target.value)}>
        <option value="rent">Rent</option>
        <option value="advance">Advance</option>
        <option value="emi">EMI</option>
      </select>
      <button onClick={handlePay}>Pay</button>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UnitDetails;
