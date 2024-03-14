import React from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import DrawerStyles from "./DrawerStyles";

export default function Info() {
    return (
        <SafeAreaView style={DrawerStyles.container}>
            <View>
                <Text style={DrawerStyles.heading}>Info</Text>
            </View>
        </SafeAreaView>
    );
}