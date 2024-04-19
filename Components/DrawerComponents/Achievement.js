import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Modal, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
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
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImagePress = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => handleImagePress(item.imageUrl)}>
            <View style={[styles.item, item.achieved ? styles.achievedItem : styles.lockedItem]}>
                <Image
                    source={item.imageUrl}
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
                            <Image
                                source={selectedImage}
                                style={styles.modalImage}
                            />
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
        backgroundColor: 'white',
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
    },
    closeText: {
        marginTop: 10,
        color: 'blue',
        fontWeight: 'bold',
    },
});