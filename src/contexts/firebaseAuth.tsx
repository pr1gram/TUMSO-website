import { initializeApp } from "@firebase/app";
import type { User } from "firebase/auth";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as logOut,
} from "firebase/auth";
import type { FC } from "react";
import { createContext, useContext, useEffect, useState } from "react";

let app; 

export interface IUser {
  isLoggedIn: () => boolean | null;
  uid?: string;
  email?: string | null;
}

interface FirebaseAuthContextInterface {
  signIn: (action?: () => any | Promise<any>) => void;
  signOut: () => void;
  user: IUser;
}

const defaultContextValue: FirebaseAuthContextInterface = {
  signIn: (_) => {},
  signOut: () => {},
  user: {
    isLoggedIn: () => null,
    uid: undefined,
    email: "",
  },
};

const FirebaseAuthContext =
  createContext<FirebaseAuthContextInterface>(defaultContextValue);

export const useFirebaseAuth = () => {
  return useContext(FirebaseAuthContext);
};

const useFBAuthAction = (): FirebaseAuthContextInterface => {
  const [user, setUser] = useState<User | null>(null);
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app!);

  useEffect(() => {
    auth.onAuthStateChanged((userd) => {
      setUser(userd);
    });
  }, [auth]);

  const isLoggedIn = () => {
    return user === null ? null : !!user;
  };

  const signIn = (action?: () => any | Promise<any>) => {
    console.log("test")
    signInWithPopup(auth, provider).then((result) => {
      if (action) action();
    });
  };

  const signOut = () => {
    logOut(auth);
  };

  return {
    signIn,
    signOut,
    user: {
      isLoggedIn,
      uid: user?.uid,
      email: user?.email,
    },
  };
};

export const FirebaseAuthProvider: FC<{ children: any }> = ({ children }) => {
  const firebaseConfig = {
    apiKey: "AIzaSyCrJsCihByUG2zfA1WC5OrtOKzcw7uMPEk",
    authDomain: "tumso-b2eca.firebaseapp.com",
    projectId: "tumso-b2eca",
    storageBucket: "tumso-b2eca.firebasestorage.app",
    messagingSenderId: "349745531264",
    appId: "1:349745531264:web:490f83265d66740af49965",
    measurementId: "G-LTM5QKPDW2",
  };

  if (!app!) {
    app = initializeApp(firebaseConfig, "TUMSO"); // Initialize app once
  }

  return (
    <FirebaseAuthContext.Provider value={useFBAuthAction()}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export { app };
