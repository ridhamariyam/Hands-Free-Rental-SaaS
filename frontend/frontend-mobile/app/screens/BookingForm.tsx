import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const BookingForm = () => {
    
  const authContext = useContext(AuthContext);
  const token = authContext?.token ?? '';
  const [unitId, setUnitId] = useState('');
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [refundableFee, setRefundableFee] = useState<number | null>(null);
  const [otp, setOtp] = useState('');
  const [visitId, setVisitId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleBookVisit = async () => {
    if (!unitId || !scheduledAt || !refundableFee) {
      Alert.alert('Please fill all fields before booking');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    try {
      const response = await axios.post(
        'visits/book/',
        {
          unit_id: unitId,
          scheduled_at: scheduledAt.toISOString(),
          refundable_fee: refundableFee,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVisitId(response.data.id);
      setSuccessMessage('Visit booked successfully! OTP sent.');
    } catch (err) {
      Alert.alert('Booking failed. Please try again.');
    }
    setLoading(false);
  };

  // 🔑 Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `visits/${visitId}/verify_otp/`,
        { otp },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage('OTP verified! Your visit is confirmed.');
      setOtp('');
      setVisitId(null); // reset booking flow
    } catch (err) {
      Alert.alert('OTP verification failed. Try again.');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Book a Visit</Text>

      <TextInput
        placeholder="Unit ID"
        value={unitId}
        onChangeText={setUnitId}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />

      {/* 📅 DateTimePicker */}
      <DateTimePicker
        value={scheduledAt || new Date()}
        mode="datetime"
        display="default"
        onChange={(_event: any, date: Date | undefined) => setScheduledAt(date ?? null)}
      />

      <TextInput
        placeholder="Refundable Fee"
        value={refundableFee?.toString() || ''}
        onChangeText={(text) => setRefundableFee(Number(text))}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />

      <Button
        title={loading ? 'Booking...' : 'Book Visit'}
        onPress={handleBookVisit}
        disabled={loading}
      />

      {visitId && (
        <View style={{ marginTop: 16 }}>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          />
          <Button
            title={loading ? 'Verifying...' : 'Verify OTP'}
            onPress={handleVerifyOtp}
            disabled={loading}
          />
        </View>
      )}

      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}
      {successMessage !== '' && (
        <Text style={{ marginTop: 12, color: 'green' }}>{successMessage}</Text>
      )}
    </View>
  );
};

export default BookingForm;
