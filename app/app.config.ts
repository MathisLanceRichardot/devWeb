import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAp1F_IzqR5MzjbumZixzlXjukkUC9tp4E",
  authDomain: "domovis-c272a.firebaseapp.com",
  projectId: "domovis-c272a",
  storageBucket: "domovis-c272a.firebasestorage.app",
  messagingSenderId: "843399505165",
  appId: "1:843399505165:web:0b79b56080edd71e3bbc44",
  measurementId: "G-N06L013WLW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ]
};
