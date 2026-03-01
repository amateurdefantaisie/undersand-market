import { auth, db } from "./firebase-config.js";
import { doc, getDoc, updateDoc } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const data = snap.data();

  const today = new Date().toDateString();

  // Reset automatique si nouveau jour
  if (data.lastReset !== today) {
    await updateDoc(userRef, {
      coinsToday: 0,
      lastReset: today
    });
    data.coinsToday = 0;
  }

  document.getElementById("coins").innerText = data.coins;
  document.getElementById("coinsToday").innerText = data.coinsToday;
});
