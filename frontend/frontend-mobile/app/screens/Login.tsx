import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';

const Login = ({ navigation }: any) => {
    const authContext = useContext(AuthContext);
    const login = authContext?.login;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [kycFile, setKycFile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handlePickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({});
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setKycFile(result.assets[0]);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        if (kycFile) {
            formData.append('kyc_document', {
                uri: kycFile.uri,
                name: kycFile.name,
                type: kycFile.mimeType || 'application/octet-stream',
            } as any);
        }
        const response = await axios.post('auth/login/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data && response.data.token) {
            if (login) {
                await login(username, password); // Optionally pass token
            }
            navigation.replace('Properties');
        } else {
            Alert.alert('Login failed', 'Invalid credentials');
        }
        } catch (err) {
        Alert.alert('Login failed', 'Please try again');
        }
        setLoading(false);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 24, marginBottom: 16 }}>Login</Text>
        <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={{ width: '100%', borderWidth: 1, marginBottom: 8, padding: 8 }}
        />
        <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ width: '100%', borderWidth: 1, marginBottom: 8, padding: 8 }}
        />
        <Button title="Upload KYC Document" onPress={handlePickDocument} />
        {kycFile && <Text style={{ marginTop: 8 }}>{kycFile.name}</Text>}
        <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
        {loading && <ActivityIndicator style={{ marginTop: 8 }} />}
        </View>
    );
    };

    export default Login;
