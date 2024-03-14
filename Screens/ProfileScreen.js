import React from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";

export default function ProfileScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.heading}>Profile</Text>
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