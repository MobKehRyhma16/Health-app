import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from '../../Firebase/Config';
import { View, Text, TextInput, Button, SafeAreaView } from 'react-native';
import DrawerStyles from './DrawerStyles';
import { addDoc,collection, doc, setDoc, db } from '../../Firebase/Config';
import { useNavigation } from '@react-navigation/native';

export default function Signup() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('testuser@tester.com');
    const [password, setPassword] = useState('test123');

    const goToInfo = () => {
        navigation.navigate('Info');
    }

    async function addData(uid) {
        try {
            const userDocRef = doc(collection(db, "users"), uid);
            await setDoc(userDocRef, { email, password }); // Add user data to Firestore
            console.log("Document written with ID:", uid);
        } catch (error) {
            console.error("Error adding document:", error);
        }
    }

    const signup = async () => {
        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            addData(user.uid); // Add user data to Firestore with the same UID
            console.log('User registered:', user.uid);
            return user;
        } catch (error) {
            console.error('Error registering user:', error.message);
            return null;
        }
    };

    const handleSignupAndNavigate = async () => {
        const user = await signup(); // Wait for signup process to complete
        if (user) {
            goToInfo(); // Navigate to Info screen if signup is successful
        }
    }

    return (
        <SafeAreaView style={DrawerStyles.container}>
            <View>
                <Text style={DrawerStyles.heading}>Signup</Text>
                <Text style={DrawerStyles.field}>Email</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={email} onChangeText={text => setEmail(text)} />
                <Text style={DrawerStyles.field}>Password</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={password} onChangeText={text => setPassword(text)} />
                <Button title='Signup' onPress={handleSignupAndNavigate} />
            </View>
        </SafeAreaView>
    );
};
