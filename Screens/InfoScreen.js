import React from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import Info from "../Components/DrawerComponents/Info";

export default function InfoScreen() {

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Info />
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