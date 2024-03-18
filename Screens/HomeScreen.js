import React from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import Stepcounter from "../Components/Stepcounter";

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Stepcounter />
                <Text style={styles.heading}>Home</Text>
            </View>
        </SafeAreaView>
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