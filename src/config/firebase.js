import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAEqVfuZRc6Em_qvzni5siA6zWdYO-nTf0",
  authDomain: "gladiator-28ee6.firebaseapp.com",
  projectId: "gladiator-28ee6",
  storageBucket: "gladiator-28ee6.firebasestorage.app",
  messagingSenderId: "866503638141",
  appId: "1:866503638141:web:4a9c00c860efea84d74514"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
