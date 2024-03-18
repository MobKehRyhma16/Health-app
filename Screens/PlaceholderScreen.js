import React from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";


export default function PlaceholderScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.heading}>Placeholder</Text>
                <Text>This is a placeholder screen. It will be replaced with the actual screen.</Text>
                <Text>For now, you can use this screen to test the navigation.</Text>
                <Text>For example, you can navigate to this screen from the Home screen.</Text>
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