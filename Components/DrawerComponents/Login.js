import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import DrawerStyles from './DrawerStyles';
import { addDoc, collection, db } from "../../Firebase/Config";

export default function Login({ setLogin }) {
    
    const [email, setEmail] = useState('testuser@tester.com');
    const [password, setPassword] = useState('test123');
    
    async function addData() {
        try {
            const docRef = await addDoc(collection(db, "users"), {
              email: email,
              password: password,
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }

    const login = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setLogin(true);
                addData();
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
                <Text style={DrawerStyles.field}>Email</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={email} onChangeText={text => setEmail(text)} />
                <Text style={DrawerStyles.field}>Password</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={password} onChangeText={text => setPassword(text)} />
                <Button title='Login' onPress={login} />
            </View>
        </SafeAreaView>
    );
};
