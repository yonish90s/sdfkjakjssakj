import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            "AIzaSyDo529Vcr8UGrvanBxE1XvwT549k8hdQLo",
  authDomain:        "my-gallery-app-ca7ef.firebaseapp.com",
  projectId:         "my-gallery-app-ca7ef",
  storageBucket:     "my-gallery-app-ca7ef.firebasestorage.app",
  messagingSenderId: "519411285354",
  appId:             "1:519411285354:web:bd75ba9a18218d6c92f913",
  measurementId:     "G-8MBNMJCY8P"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
