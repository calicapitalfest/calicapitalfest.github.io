// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { firebaseWebConfig as firebaseConfig } from "$lib/firebaseWebConfig";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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