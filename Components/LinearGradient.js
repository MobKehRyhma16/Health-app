import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientStyles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
});

const GradientBackground = ({ children }) => {
    return (
        <LinearGradient
            colors={['rgb(235, 30, 123)', 'rgb(220, 120, 120)', 'rgb(225, 110, 110)']}
            style={GradientStyles.gradientBackground}
        >
            {children}
        </LinearGradient>
    );
};

export default GradientBackground;
