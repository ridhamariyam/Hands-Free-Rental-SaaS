import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import PropertyList from '../screens/PropertyList';
import BookingForm from '../screens/BookingForm';
import UnitDetails from '../screens/UnitDetails';

type RootStackParamList = {
  Login: undefined;
  Properties: undefined;
  Book: undefined;
  UnitDetails: { unitId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Properties" component={PropertyList} />
        <Stack.Screen name="Book" component={BookingForm} />
        <Stack.Screen name="UnitDetails" component={UnitDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
