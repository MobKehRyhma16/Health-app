import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from '../../Firebase/Config';
import { View, Text, TextInput, Button, SafeAreaView } from 'react-native';
import DrawerStyles from './DrawerStyles';
import { addDoc, collection, doc, setDoc, db } from '../../Firebase/Config';

export default function Signup({ setLogin }) {
    const [email, setEmail] = useState('testuser@tester.com');
    const [password, setPassword] = useState('test123');
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
            addData(user.uid);
            console.log('User registered:', user.uid);
            setLogin(true);
            return true;
        } catch (error) {
            console.error('Error registering user:', error.message);
            throw error;
        }
    };
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|fi|net)$/i;
        return emailRegex.test(email);
    };

    const SignupHandler = async () => {
        setIsError(false);
        setErrorMessage('');

        if (email === '' || password === '') {
            setIsError(true);
            setErrorMessage('Please fill in all fields');
            return;
        } else if (password.length < 6) {
            setIsError(true);
            setErrorMessage('Password must be at least 6 characters long');
            return;
        } else if (!isValidEmail(email)) {
            setIsError(true);
            setErrorMessage('Invalid email address');
            return;
        }
    
        try {
            await signup();

        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setIsError(true);
                setErrorMessage('Email already in use');
            } else {
                setIsError(true);
                setErrorMessage('Invalid credentials');
            }
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
                <Button title='Signup' onPress={SignupHandler} />
                {isError &&
                    <Text style={DrawerStyles.field}>{errorMessage}
                    </Text>}
            </View>
        </SafeAreaView >
    );
};
