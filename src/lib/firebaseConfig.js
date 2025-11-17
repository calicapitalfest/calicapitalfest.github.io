// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  authDomain: "lockombia-2025.firebaseapp.com",
  databaseURL: "https://lockombia-2025-default-rtdb.firebaseio.com",
  projectId: "lockombia-2025",
  storageBucket: "lockombia-2025.firebasestorage.app",
  messagingSenderId: "673214735446",
  appId: "1:673214735446:web:522f348737ebb90ed3c7f7",
  measurementId: "G-V3YSEJBYE0"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);

// run only in browser
export let analytics;
if (typeof window !== "undefined") {
  isSupported().then(ok => {
    if (ok) analytics = getAnalytics(app);
  });
}

export { app };