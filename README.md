# Health-app

The project was created by second-year students of Oulu University of Applied Sciences for the Mobile Application Project course. The goal of the project was to develop a mobile health-app that shows all basic data from workouts like steps, calories burned, route, weekly goals and more. The app was created using React Native and Expo. The database was created using Firestore. 

## How the app works

When the app starts, user can choose between login and register. After that the app shows the homescreen-page and footer so user can navigate between pages. In workout-page after the app asks permission to use location data, user can choose the workout type. During the workout, location data and values collected by sensors are saved. The traveled route is plotted on a map, and other variables are displayed in a collapsible view. Upon completion, the user can choose to save the workout to the database, where it will appear with its route on the history page. User can customize their information at profile-page and set daily goals. 

#### Login and Homepage
<img src="https://github.com/MobKehRyhma16/Health-app/assets/112471004/7b5bcd9c-343c-4fe4-9ae6-d51809ece184" alt="Login" style="width:200px;">
<img src="https://github.com/MobKehRyhma16/Health-app/assets/112471004/dde89fff-b87f-42ad-a655-76c2e1849403" alt="Homepage" style="width:200px;">

#### Workout screen and ongoing workout
<img src="https://github.com/MobKehRyhma16/Health-app/assets/112471004/3227dcb2-531a-4a37-bf7e-fda323b086b3" alt="Workout screen" style="width:200px;">
<img src="https://github.com/MobKehRyhma16/Health-app/assets/112471004/43424a13-3a43-4c34-9296-5975ab823c95" alt="Ongoing workout" style="width:200px;">

#### History and route
<img src="https://github.com/MobKehRyhma16/Health-app/assets/112471004/e936318d-3ac1-4f46-a2fa-927b85daf876" alt="History" style="width:200px;">
<img src="https://github.com/MobKehRyhma16/Health-app/assets/112471004/16da1e75-1a0d-4ef5-a9f3-ad8f5b86f8ea" alt="Workout specific route" style="width:200px;">

#### Profile, settings and achievements
<img src="https://github.com/MobKehRyhma16/Health-app/assets/112471004/29a27d8c-69f9-4b21-8d2f-d7701c1745e1" alt="Profile" style="width:200px;">
<img src="https://github.com/MobKehRyhma16/Health-app/assets/112471004/d9ca6074-5654-4aae-a5cd-9af3588d4f8b" alt="Settings" style="width:200px;">
<img src="https://github.com/MobKehRyhma16/Health-app/assets/112471004/349943d9-49fc-4245-aa6a-fcaf44d0a857" alt="Achievements" style="width:200px;">



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
