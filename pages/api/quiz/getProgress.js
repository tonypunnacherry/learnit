import _ from 'lodash';

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebaseConfig.js";

export default async function handler(req, res) {
    const { user, quiz } = req.body;

    const myDoc = doc(db, "users", user);
    const myUser = await getDoc(myDoc);

    let info = myUser.data();

    if (!info.quizActivity[quiz.sys.id]) {
        let template = {};
        template[quiz.sys.id] = new Array(quiz.fields.questions).fill(0);
        await updateDoc(myDoc, { quizActivity: template })
        return res.status(200).json({ correct: template[quiz.sys.id] });
    }

    res.status(200).json({ correct: info.quizActivity[quiz.sys.id] });
}
