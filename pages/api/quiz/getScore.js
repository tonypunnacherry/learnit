import _ from 'lodash';

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebaseConfig.js";

async function saveScore(myDoc, info, id, correct) {
    if (!info.quizScores[id]) {
        await updateDoc(myDoc, { [`quizScores.${id}`]: { first: 0, best: 0, recent: 0, mastery: 0 } });
        await updateDoc(myDoc, { [`quizScores.${id}.first`]: correct });
    }
    if (correct > info.quizScores[id].best) {
        await updateDoc(myDoc, { [`quizScores.${id}.best`]: correct });
    }
    await updateDoc(myDoc, { [`quizScores.${id}.recent`]: correct });

    delete info.quizActivity[id];
    updateQuizData(myDoc, info.quizActivity);
}

async function updateQuizData(myDoc, quizActivity) {
    await updateDoc(myDoc, { quizActivity });
}

export default async function handler(req, res) {
    const { user, quizId } = req.body;

    const myDoc = doc(db, "users", user);
    const myUser = await getDoc(myDoc);

    let info = myUser.data();

    res.status(200).json({ correct: info.quizActivity[quizId] });

    saveScore(myDoc, info, quizId, info.quizActivity[quizId].filter(val => val == 1).length);
}
