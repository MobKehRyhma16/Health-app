# Health-app

The project was created by second-year students of Oulu University of Applied Sciences for the Mobile Application Project course. The goal of the project was to develop a mobile health-app that shows all basic data from workouts like steps, calories burned, route, weekly goals and more. The app was created using React Native and Expo. The database was created using Firestore. 

## How the app works

When the app starts, user can choose between login and register. After that the app shows the homescreen-page and footer so user can navigate between pages. In workout-page after the app asks permission to use location data, user can choose the workout type. During the workout, location data and values collected by sensors are saved. The traveled route is plotted on a map, and other variables are displayed in a collapsible view. Upon completion, the user can choose to save the workout to the database, where it will appear with its route on the history page. User can customize their information at profile-page and set daily goals. 

## Deployment

1. Install expo on your pc and expo-go on your mobile device.
2. Install node.js
3. Clone the repository to your folder
4. Create your own database on firestore
5. Create .env file that has your firestore apikeys and other essentials on root
6. Open terminal and type "npm install"
7. Make sure you are in same WiFi as your phone and type "npx expo start"
8. Open expo-go on your phone and read the QR-code
9. Launching the app first time might take a while

## Project Members

Joonatan Niinimaa  
Eerik Väisänen  
Joonas Ridanpää  
Santtu Niskanen  
Roope Ylikulju
