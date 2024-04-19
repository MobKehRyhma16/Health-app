import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Modal, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import GradientBackground from '../../Components/LinearGradient';

export default function Achievements() {
    const images = {
        distance: { uri: require('./AchImg/distance.png'), text: 'From Marathon to Athens: Run in total 42 kilometers' },
        speed: { uri: require('./AchImg/speed.png'), text: 'The Speed Demon: Have a running speed of 16km per hour' },
        workout: { uri: require('./AchImg/workout.png'), text: 'Workout Warrior: Complete 10 workouts' },
    };

    const data = [
        { id: '1', image: images.distance, achieved: false },
        { id: '2', image: images.speed, achieved: false },
        { id: '3', image: images.workout, achieved: false },
        { id: '4', image: images.workout, achieved: false },
        { id: '5', image: images.workout, achieved: false },
        { id: '6', image: images.workout, achieved: true },
    ];

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImagePress = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => handleImagePress(item.image)}>
            <View style={[styles.item, item.achieved ? styles.achievedItem : styles.lockedItem]}>
                <Image
                    source={item.image.uri}
                    style={styles.image}
                />
            </View>
        </TouchableWithoutFeedback>
    );

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Text>Achieved Achievements</Text>
                <View style={styles.gridContainer}>
                    <FlatList
                        data={data.filter(item => item.achieved)}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                    />
                </View>
                <Text>Locked Achievements</Text>
                <View style={styles.gridContainer}>
                    <FlatList
                        data={data.filter(item => !item.achieved)}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                    />
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {selectedImage && (
                                <>
                                    <Image
                                        source={selectedImage.uri}
                                        style={styles.modalImage}
                                    />
                                    <Text style={styles.modalText}>{selectedImage.text}</Text>
                                </>
                            )}
                            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeText}>Close</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </GradientBackground>
    );
}


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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'lightblue',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    closeText: {
        marginTop: 10,
        color: 'blue',
        fontWeight: 'bold',
    },
    modalText: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 18, 
        fontWeight: 'bold',
    },
});