import React from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import GradientBackground from '../Components/LinearGradient';

export default function ProfileScreen() {
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View>
                    <Text style={styles.heading}>Profile</Text>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});