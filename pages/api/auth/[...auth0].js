import { handleAuth, handleCallback, handleLogout } from '@auth0/nextjs-auth0';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebaseConfig.js";

const afterCallback = async (req, res, session, state) => {
  const myDoc = doc(db, "users", session.user.sub);
  const user = await getDoc(myDoc);
  if (!user.exists()) {
    await setDoc(doc(db, "users", session.user.sub), {
      coins: 0,
      xp: 0,
      friends: [],
      quizActivity: {},
      quizScores: {},
      season_xp: 0,
      username: session.user.name.replaceAll(' ', '_').toLowerCase(),
      name: session.user.name
    });
  }
  return session;
};

export default handleAuth({
  async callback(req, res) {
    try {
      // Pass custom parameters to login
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      res.status(error.status || 400).end(error.message);
    }
  },
  async logout(req, res) {
    try {
      // Pass custom parameters to login
      await handleLogout(req, res);
    } catch (error) {
      res.status(error.status || 400).end(error.message);
    }
  }
});