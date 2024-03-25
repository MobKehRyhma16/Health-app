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
});

export default DrawerStyles;
