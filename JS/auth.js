import { auth, db } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Inscription
window.register = async function(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email: email,
    coins: 0,
    coinsToday: 0,
    lastReset: new Date().toDateString(),
    createdAt: new Date()
  });

  alert("Compte créé !");
};

// Connexion
window.login = async function(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
  window.location.href = "dashboard.html";
};
