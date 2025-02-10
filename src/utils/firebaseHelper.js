// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const getFirebaseApp = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyDSfLXQjkaFFwz41904WYbifrjvbBNOHEI",
  authDomain: "chatgpt-b875b.firebaseapp.com",
  projectId: "chatgpt-b875b",
  storageBucket: "chatgpt-b875b.firebasestorage.app",
  messagingSenderId: "408856187399",
  appId: "1:408856187399:web:9368138281b8405cd090a2",
    }

    // Initialize Firebase
    return initializeApp(firebaseConfig)
}
