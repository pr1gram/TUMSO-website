import { initializeApp } from "@firebase/app"
import type { User } from "firebase/auth"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as logOut
} from "firebase/auth"
import type { FC } from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface FirebaseAuthContextInterface {
  signIn: (action?: () => any | Promise<any>) => void
  signOut: () => void
  user: {
    isLoggedIn: () => boolean
    uid?: string
  }
}
const defaultContextValue: FirebaseAuthContextInterface = {
  signIn: (_) => {},
  signOut: () => {},
  user: {
    isLoggedIn: () => false,
    uid: undefined
  }
}

const FirebaseAuthContext =
  createContext<FirebaseAuthContextInterface>(defaultContextValue)

export const useFirebaseAuth = () => {
  return useContext(FirebaseAuthContext)
}

const useFBAuthAction = (): FirebaseAuthContextInterface => {
  const [user, setUser] = useState<User | null>(null)
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  useEffect(() => {
    auth.onAuthStateChanged((userd) => {
      setUser(userd)
    })
  }, [])
  const isLoggedIn = () => {
    return !!user
  }

  const signIn = (action?: () => any | Promise<any>) => {
    signInWithPopup(auth, provider).then((result) => {
      if (action) action()
    })
  }

  const signOut = () => {
    logOut(auth)
  }

  return {
    signIn,
    signOut,
    user: {
      isLoggedIn,
      uid: user?.uid
    }
  }
}
export const FirebaseAuthProvider: FC<{ children: any }> = ({ children }) => {
  const firebaseConfig = {
    apiKey: "AIzaSyALUVyqqKbNLDFSRDzP-wDsqdlhNdhnKww",
    authDomain: "tumso-49144.firebaseapp.com",
    projectId: "tumso-49144",
    storageBucket: "tumso-49144.appspot.com",
    messagingSenderId: "183078975975",
    appId: "1:183078975975:web:d1c7436fa6fc91f1d2e542"
  }
  initializeApp(firebaseConfig)
  return (
    <FirebaseAuthContext.Provider value={useFBAuthAction()}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}
