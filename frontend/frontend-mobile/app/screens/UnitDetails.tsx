import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, TextInput, ActivityIndicator, Alert } from 'react-native';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

interface UnitDetailsProps {
  route: { params: { unitId: string } };
}

const UnitDetails: React.FC<UnitDetailsProps> = ({ route }) => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token;
  const { unitId } = route.params;
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState('rent');

  useEffect(() => {
    const fetchUnit = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`units/${unitId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnit(response.data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch unit');
      }
      setLoading(false);
    };
    fetchUnit();
  }, [unitId, token]);

  const handleBookUnit = async () => {
    try {
      await axios.post(`units/${unitId}/book/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Unit booked successfully!');
    } catch (err) {
      Alert.alert('Error', 'Booking failed');
    }
  };

  const handlePay = async () => {
    try {
      await axios.post('payments/', {
        unit: unitId,
        amount: paymentAmount,
        payment_type: paymentType,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Payment successful!');
    } catch (err) {
      Alert.alert('Error', 'Payment failed');
    }
  };

  if (loading) return <ActivityIndicator />;
  if (!unit) return <Text>No unit found.</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24 }}>{unit.name}</Text>
      <Text>{unit.description}</Text>
      <Text>Booked: {unit.is_booked ? 'Yes' : 'No'}</Text>
      <Button title="Book Unit" onPress={handleBookUnit} disabled={unit.is_booked} />
      <Text style={{ marginTop: 16, fontWeight: 'bold' }}>Make a Payment</Text>
      <TextInput
        placeholder="Amount"
        value={paymentAmount}
        onChangeText={setPaymentAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Payment Type (rent, advance, emi)"
        value={paymentType}
        onChangeText={setPaymentType}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Button title="Pay" onPress={handlePay} />
    </View>
  );
};

export default UnitDetails;
