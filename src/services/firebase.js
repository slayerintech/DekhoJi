import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAtAiwfPrJOCHakg1NcqRRovn9zKfChwp0",
  authDomain: "dekhoji-a2c34.firebaseapp.com",
  projectId: "dekhoji-a2c34",
  storageBucket: "dekhoji-a2c34.firebasestorage.app",
  messagingSenderId: "1014858874602",
  appId: "1:1014858874602:web:f3d3bda09816c087b26193",
  measurementId: "G-L82422C49W"
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const googleProvider = new GoogleAuthProvider()

export { app, auth, db, googleProvider }