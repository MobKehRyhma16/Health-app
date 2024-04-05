import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import ActivityCalculator from './ActivityCalculator';
import Stepcounter from './Stepcounter';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Activitybar(){
    return (
        <LinearGradient
            colors={['#00FF00', '#FF0000']}
            style={styles.container}>
            <Text style={styles.title}>Todays Activity</Text>
            <Stepcounter />
            <ActivityCalculator/>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 20,
        marginTop: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
        textTransform: 'uppercase',
    },
});