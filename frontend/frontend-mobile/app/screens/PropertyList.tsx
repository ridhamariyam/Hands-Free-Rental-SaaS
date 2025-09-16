import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  PropertyList: undefined;
  UnitDetails: { unitId: number };
};

const PropertyList = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await axios.get('properties/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperties(response.data);
      } catch (err) {
        // Handle error
      }
      setLoading(false);
    };
    fetchProperties();
  }, [token]);

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
              {item.units && item.units.map((unit: any) => (
                <TouchableOpacity
                  key={unit.id}
                  onPress={() => navigation.navigate('UnitDetails', { unitId: unit.id })}
                  style={{ marginTop: 4, padding: 4, backgroundColor: '#eee' }}
                >
                  <Text>{unit.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default PropertyList;
