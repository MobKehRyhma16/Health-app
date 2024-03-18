import React, { useState } from 'react';
import Firebase from '../../Firebase/Config';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import DrawerStyles from './DrawerStyles';

export default function Login({ setLogin }) {
    
    const [username, setUsername] = useState('testuser@tester.com');
    const [password, setPassword] = useState('test123');

    const login = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setLogin(true);
            }).catch((error) => {
                if (error.code === 'auth/wrong-password' || error.code == 'auth/user-not-found') {
                    console.log('Invalid credentials!');
                } else if ((error.code === 'auth/too-many-requests')) {
                    console.log('Too many attempts to login.');
                } else {
                    console.log(error.code + ' ' + error.message);
                }
            })
    }

    return (
        <SafeAreaView style={DrawerStyles.container}>
            <View>
                <Text style={DrawerStyles.heading}>Login</Text>
                <Text style={DrawerStyles.field}>Username</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={username} onChangeText={text => setUsername(text)} />
                <Text style={DrawerStyles.field}>Password</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={password} onChangeText={text => setPassword(text)} />
                <Button title='Login' onPress={login} />
            </View>
        </SafeAreaView>
    );
};
