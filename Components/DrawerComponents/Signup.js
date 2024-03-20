import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from '../../Firebase/Config';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import DrawerStyles from './DrawerStyles';

export default function Signup() {

    const [email, setEmail] = useState('testuser@tester.com');
    const [password, setPassword] = useState('test123');

    const signup = async () => {

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // User registration successful
            const user = userCredential.user;
            console.log('User registered:', user.uid);
            return user; // Return user data if needed
        } catch (error) {
            // Handle errors
            if (error.code === 'auth/email-already-in-use') {
                console.log('Email address is already in use.');
            } else if (error.code === 'auth/weak-password') {
                console.log('Password is too weak.');
            } else {
                console.error('Error registering user:', error.message);
            }
            return null; // Return null or handle error as needed
        }
    };

    return (
            <SafeAreaView style={DrawerStyles.container}>
                <View>
                    <Text style={DrawerStyles.heading}>Signup</Text>
                    <Text style={DrawerStyles.field}>Email</Text>
                    <TextInput style={DrawerStyles.field} keyboardType='default' value={email} onChangeText={text => setEmail(text)} />
                    <Text style={DrawerStyles.field}>Password</Text>
                    <TextInput style={DrawerStyles.field} keyboardType='default' value={password} onChangeText={text => setPassword(text)} />
                    <Button title='Signup' onPress={signup} />
                </View>
            </SafeAreaView>
    );
};
