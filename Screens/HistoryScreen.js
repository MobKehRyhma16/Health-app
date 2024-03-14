import React from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";


export default function HistoryScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.heading}>History</Text>
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