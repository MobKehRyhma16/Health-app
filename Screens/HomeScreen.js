import React from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import Stepcounter from "../Components/Stepcounter";
import GradientBackground from '../Components/LinearGradient';
import Activitybar from "../Components/Activitybar";
import { useUserId } from "../Components/UserIdContext";

export default function HomeScreen() {
    const {userDocumentId} = useUserId()

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View>
                    <Activitybar />
                    <Text style={styles.heading}>Home</Text>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'top',
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});