import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const PropertyList = () => {
  const auth = useContext(AuthContext);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        if (auth && auth.token) {
          const response = await axios.get('properties/', {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          setProperties(response.data);
        }
      } catch (err) {
        // Handle error
      }
      setLoading(false);
    };
    fetchProperties();
  }, [auth]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Properties</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={properties}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12, padding: 12, borderWidth: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text>{item.address}</Text>
              <Text>{item.description}</Text>
              {/* TODO: Link to units, booking, etc. */}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default PropertyList;
