import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserIdContext = createContext();

export default function UserIdProvider({ children }) {
    const [userDocumentId, setUserDocumentId] = useState(null);

    useEffect(() => {
        console.log('User id at context is: ',userDocumentId)
    }, [userDocumentId]);

    // Function to set the user ID
    const setUser = async (id) => {
        setUserDocumentId(id);
        // Save user ID to AsyncStorage
        try {
            await AsyncStorage.setItem('userId', id);
        } catch (error) {
            console.error('Error saving user ID to AsyncStorage:', error);
        }
    };

    useEffect(() => {
        // Retrieve user ID from AsyncStorage on component mount
        const getUserFromStorage = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    setUserDocumentId(storedUserId);
                }
            } catch (error) {
                console.error('Error retrieving user ID from AsyncStorage:', error);
            }
        };

        getUserFromStorage();
    }, []);


    return (
        <UserIdContext.Provider value={{ userDocumentId, setUserDocumentId, setUser }}>
            {children}
        </UserIdContext.Provider>
    );
}

export function useUserId() {
    return useContext(UserIdContext);
}