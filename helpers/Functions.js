
// Helper functions

export const convertFirebaseTimeStampToJS = (time) => {
    if (time !== null && time !== undefined) {
        const fireBaseTime = new Date(
            time.seconds * 1000 + time.nanoseconds / 1000000 // Corrected division
        );
        return (
            fireBaseTime.getDate() + '.' +
            (fireBaseTime.getMonth() + 1) + '.' +
            fireBaseTime.getFullYear() + ' ' +
            fireBaseTime.getHours() + '.' +
            String(fireBaseTime.getMinutes()).padStart(2, '0') + '.' +
            String(fireBaseTime.getSeconds()).padStart(2, '0')
        ); 
    }
}

export function parseDurationToSeconds(durationString) {
    // Split the duration string into hours, minutes, and seconds
    const [hours, minutes, seconds] = durationString.split(':').map(Number);

    // Calculate the total duration in seconds
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    return totalSeconds;
}

export const parseArrayToCoordinates = (arrayOfPairs) => {
    return arrayOfPairs.map(pair => ({
      latitude: pair[0],
      longitude: pair[1]
    }));
};