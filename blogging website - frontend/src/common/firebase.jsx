import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUfV8J3uotx-jzWwmeiMKejkzPrH_M2uQ",
  authDomain: "geeksblogging2.firebaseapp.com",
  projectId: "geeksblogging2",
  storageBucket: "geeksblogging2.appspot.com",
  messagingSenderId: "163390942285",
  appId: "1:163390942285:web:3a4c6873a07c1991278004",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });

  return user;
};
