import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, SafeAreaView } from 'react-native';
import DrawerStyles from './DrawerStyles';
import { getAuth, doc, getDoc, updateDoc, db } from '../../Firebase/Config';
import { Picker } from '@react-native-picker/picker';

export default function Info() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [length, setLength] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        fetchUserInfo(); // Fetch user information when component mounts
    }, []);

    async function fetchUserInfo() {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                console.log("No user signed in.");
                return;
            }

            const uid = user.uid;
            const userDocRef = doc(db, "users", uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                // Update state with existing user data
                setFirstname(userData.firstname || ''); // If the field doesn't exist, default to an empty string
                setLastname(userData.lastname || '');
                setLength(userData.length || '');
                setWeight(userData.weight || '');
                setAge(userData.age || '');
                setGender(userData.gender || '');
                setAvatar(userData.avatar || '');
            } else {
                console.log("User document does not exist.");
            }
        } catch (error) {
            console.error("Error fetching user information:", error);
        }
    }

    async function addInfo() {

        try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.log("No user signed in.");
            return; // Exit early if no user is signed in
        }

        const uid = user.uid; // Get user's UID

        // Reference the user's document under the "users" collection
        const userDocRef = doc(db, "users", uid); // Construct reference to user document

        // Update the existing user document with the new information
        await updateDoc(userDocRef, {
            firstname: firstname,
            lastname: lastname,
            length: length,
            weight: weight,
            age: age,
            gender: gender,
            avatar: avatar
        });

        console.log("User information updated successfully.");
    } catch (error) {
        console.error("Error updating user information:", error);
    }
    }
    return (
        <SafeAreaView style={DrawerStyles.container}>
            <View>
                <Text style={DrawerStyles.heading}>My information</Text>
                <Text style={DrawerStyles.field}>Firstname</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={firstname} onChangeText={text => setFirstname(text)} />
                <Text style={DrawerStyles.field}>Lastname</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={lastname} onChangeText={text => setLastname(text)} />
                <Text style={DrawerStyles.field}>Height</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={length} onChangeText={text => setLength(text)} />
                <Text style={DrawerStyles.field}>Weight</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={weight} onChangeText={text => setWeight(text)} />
                <Text style={DrawerStyles.field}>Age</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={age} onChangeText={text => setAge(text)} />
                <Text style={DrawerStyles.field}>Gender</Text>
                <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue, itemIndex) => setGender(itemValue)}>
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Other" value="other" />
                </Picker>
                <Button title='Continue' onPress={addInfo} />
            </View>
        </SafeAreaView>
    );
};


