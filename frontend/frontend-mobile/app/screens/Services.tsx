import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Services = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token;
  const [services, setServices] = useState<any[]>([]);
  const [propertyId, setPropertyId] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('services/', {
        headers: { Authorization: `Bearer ${token}` },
        params: propertyId ? { property: propertyId } : {},
      });
      setServices(response.data);
    } catch (err) {
      // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, [propertyId, token]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Service Directory</Text>
      <TextInput
        placeholder="Property ID (optional)"
        value={propertyId}
        onChangeText={setPropertyId}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Button title="Fetch Services" onPress={fetchServices} disabled={loading} />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={services}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 8, padding: 8, borderWidth: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.service_type}</Text>
              <Text>Vendor: {item.vendor}</Text>
              <Text>Contact: {item.contact_info}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Services;
