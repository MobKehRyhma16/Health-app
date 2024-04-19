import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Image, Text } from 'react-native';
import GradientBackground from '../../Components/LinearGradient';

export default function Achievements() {

    const images = {
        distance: require('./AchImg/distance.png'),
        speed: require('./AchImg/speed.png'),
        workout: require('./AchImg/workout.png'),

    };
    // Sample data for the images
    const data = [
        { id: '1', imageUrl: images.distance, achieved: false },
        { id: '2', imageUrl: images.speed, achieved: false },
        { id: '3', imageUrl: images.workout, achieved: false },
        { id: '4', imageUrl: images.workout, achieved: false },
        { id: '5', imageUrl: images.workout, achieved: false },
        { id: '5', imageUrl: images.workout, achieved: true },

    ];
    const achievedData = data.filter(item => item.achieved);
    const lockedData = data.filter(item => !item.achieved);

    const renderItem = ({ item }) => (
        <View style={[styles.item, item.achieved ? styles.achievedItem : styles.lockedItem]}>
            <Image
                source={item.imageUrl}
                style={styles.image}
            />
        </View>
    );

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Text>Achieved Achievements</Text>
                <View style={styles.gridContainer}>
                    <FlatList
                        data={achievedData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                    />
                </View>
                <Text>Locked Achievements</Text>
                <View style={styles.gridContainer}>
                    <FlatList
                        data={lockedData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                    />
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        width: '33.333%', 
        aspectRatio: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1,
        borderColor: 'transparent', 
    },
    image: {
        flex: 1,
        aspectRatio: 1, 
        resizeMode: 'contain', 
        width: '100%',
    },
    achievedItem: {
        opacity: 1,
    },
    lockedItem: {
        opacity: 0.3,
    },
});
