import { auth, db } from "./firebase-config.js";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.loadRandomSurvey = async function() {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  if (userData.coinsToday >= 10) {
    alert("Limite journalière atteinte !");
    return;
  }

  const surveysSnapshot = await getDocs(collection(db, "surveys"));
  const surveys = surveysSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const activeSurveys = surveys.filter(s => s.active);

  const randomSurvey = activeSurveys[Math.floor(Math.random() * activeSurveys.length)];

  document.getElementById("question").innerText = randomSurvey.question;

  window.currentSurvey = randomSurvey;
};

window.answerSurvey = async function() {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);

  await addDoc(collection(db, "surveyAnswers"), {
    userId: user.uid,
    surveyId: currentSurvey.id,
    answeredAt: new Date()
  });

  await updateDoc(userRef, {
    coins: increment(1),
    coinsToday: increment(1)
  });

  alert("+1 pièce !");
};

import { increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
