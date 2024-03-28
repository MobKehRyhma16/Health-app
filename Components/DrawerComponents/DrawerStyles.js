import React from 'react';
import { StyleSheet, View } from 'react-native';

const DrawerStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    drawerContainer: {
        width: 200,
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
    bold: {
        fontWeight: 'bold',
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    Button: {
        width: 150,
        height: 40, 
        borderRadius: 20, 
        backgroundColor: 'blue', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    LongerButton: {
        width: 300,
        height: 40, 
        borderRadius: 20, 
        backgroundColor: 'blue', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white', 
        fontWeight: 'bold',
    },
    logo: {
        width: 300,
        height: 200, 
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
});

export default DrawerStyles;
