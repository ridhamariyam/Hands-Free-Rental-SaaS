import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Tickets = () => {
  const { token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [description, setDescription] = useState('');
  const [unitId, setUnitId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('tickets/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);
      } catch (err) {
        setError('Failed to fetch tickets');
      }
      setLoading(false);
    };
    fetchTickets();
  }, [token]);

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('tickets/', { description, unit: unitId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Ticket raised!');
      setDescription('');
      setUnitId('');
    } catch (err) {
      setError('Failed to raise ticket');
    }
    setLoading(false);
  };

  return (
    <div className="tickets-container">
      <h2>Maintenance Tickets</h2>
      <form onSubmit={handleRaiseTicket}>
        <input
          type="text"
          placeholder="Unit ID"
          value={unitId}
          onChange={e => setUnitId(e.target.value)}
          required
        />
        <textarea
          placeholder="Describe the issue"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Raise Ticket'}</button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Your Tickets</h3>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>
            <strong>{ticket.status}</strong>: {ticket.description} (Unit: {ticket.unit})
            {ticket.escalated && <span style={{ color: 'orange' }}> [Escalated]</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tickets;
