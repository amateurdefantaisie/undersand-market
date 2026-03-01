import { auth, db } from "./firebase-config.js";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  increment 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentSurvey = null;

window.loadSurvey = async function() {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  if (userData.coinsToday >= 10) {
    alert("Limite journalière atteinte !");
    return;
  }

  const snapshot = await getDocs(collection(db, "surveys"));
  const surveys = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(s => s.active);

  currentSurvey = surveys[Math.floor(Math.random() * surveys.length)];

  document.getElementById("question").innerText = currentSurvey.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  currentSurvey.options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => answerSurvey();
    optionsDiv.appendChild(btn);
  });
};

async function answerSurvey() {
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

  alert("+1 pièce gagnée !");
  location.reload();
}
