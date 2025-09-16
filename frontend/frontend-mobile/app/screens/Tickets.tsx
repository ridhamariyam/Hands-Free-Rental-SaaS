import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Tickets = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token;
  const [tickets, setTickets] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [unitId, setUnitId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await axios.get('tickets/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch tickets');
      }
      setLoading(false);
    };
    fetchTickets();
  }, [token]);

  const handleRaiseTicket = async () => {
    setLoading(true);
    try {
      await axios.post('tickets/', { description, unit: unitId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Ticket raised!');
      setDescription('');
      setUnitId('');
    } catch (err) {
      Alert.alert('Error', 'Failed to raise ticket');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Maintenance Tickets</Text>
      <TextInput
        placeholder="Unit ID"
        value={unitId}
        onChangeText={setUnitId}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Describe the issue"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Button title={loading ? 'Submitting...' : 'Raise Ticket'} onPress={handleRaiseTicket} disabled={loading} />
      <Text style={{ marginTop: 16, fontWeight: 'bold' }}>Your Tickets</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 8, padding: 8, borderWidth: 1 }}>
              <Text>Status: {item.status}</Text>
              <Text>{item.description}</Text>
              <Text>Unit: {item.unit}</Text>
              {item.escalated && <Text style={{ color: 'orange' }}>[Escalated]</Text>}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Tickets;
