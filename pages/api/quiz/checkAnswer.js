// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createClient } from 'contentful';
import _ from 'lodash';

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebaseConfig.js";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

async function updateInfo(correct, user, quizId, questions, currentQuestion) {
  const myDoc = doc(db, "users", user);
  const myUser = await getDoc(myDoc);

  let info = myUser.data();
  let template = {};
  if (!info.quizActivity[quizId]) {
    template[quizId] = new Array(questions).fill(0);
    await updateDoc(myDoc, { quizActivity: template })
  } else {
    template[quizId] = info.quizActivity[quizId];
  }
  template[quizId][currentQuestion-1] = correct ? 1 : -1;
  await updateDoc(myDoc, { quizActivity: template });
}

export default async function handler(req, res) {
  const { question, answer, user, quizId, questions, currentQuestion } = req.body;

  const data = await client.getEntries({
    content_type: "question",
    "sys.id": question,
    select: ['fields.correctAnswer'].join(',')
  });

  const correct = data.items[0].fields.correctAnswer == answer;

  if (user) await updateInfo(correct, user, quizId, questions, currentQuestion );

  res.status(200).json({ correct });
}
