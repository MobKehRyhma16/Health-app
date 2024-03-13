import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import { app } from '../Firebase/Config';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.heading}>Login</Text>
                <Text style={styles.field}>Username</Text>
                <TextInput style={styles.field} keyboardType='default' value={username} onChangeText={text => setUsername(text)} />
                <Text style={styles.field}>Password</Text>
                <TextInput style={styles.field} keyboardType='default' value={password} onChangeText={text => setPassword(text)} />
                <Button title='Login' onPress={login} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    field: {
        marginBottom: 8,
    },
    errorMessage: {
        marginBottom: 16,
    },
});