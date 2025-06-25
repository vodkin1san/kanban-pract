import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWM7WxNT-pDHKTrWqrvlVGms5D9-4pdqg",
  authDomain: "kanban-board-app-50885.firebaseapp.com",
  projectId: "kanban-board-app-50885",
  storageBucket: "kanban-board-app-50885.firebasestorage.app",
  messagingSenderId: "433924575998",
  appId: "1:433924575998:web:669377b2cbe5b479278baf",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
