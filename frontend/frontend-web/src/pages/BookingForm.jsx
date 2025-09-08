import React, { useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const BookingForm = () => {
  const { token } = useContext(AuthContext);
  const [unitId, setUnitId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [refundableFee, setRefundableFee] = useState('');
  const [otp, setOtp] = useState('');
  const [visitId, setVisitId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBookVisit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('visits/book/', {
        unit_id: unitId,
        scheduled_at: scheduledAt,
        refundable_fee: refundableFee,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitId(response.data.id);
      setSuccess('Visit booked! OTP sent.');
    } catch (err) {
      setError('Booking failed');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`visits/${visitId}/verify_otp/`, { otp }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('OTP verified!');
    } catch (err) {
      setError('OTP verification failed');
    }
    setLoading(false);
  };

  return (
    <div className="booking-form-container">
      <h2>Book a Visit</h2>
      <form onSubmit={handleBookVisit}>
        <input
          type="text"
          placeholder="Unit ID"
          value={unitId}
          onChange={e => setUnitId(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={e => setScheduledAt(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Refundable Fee"
          value={refundableFee}
          onChange={e => setRefundableFee(e.target.value)}
        />
        <button type="submit" disabled={loading}>{loading ? 'Booking...' : 'Book Visit'}</button>
      </form>
      {visitId && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default BookingForm;
