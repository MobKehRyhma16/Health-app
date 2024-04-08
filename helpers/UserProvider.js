import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    const setUserContext = (id) => {
        console.log('User ID set:', id); // Add console log here
        setUserId(id);
    };

    return (
        <UserContext.Provider value={{ userId, setUserContext }}>
            {children}
        </UserContext.Provider>
    );
};
