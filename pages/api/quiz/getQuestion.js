// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createClient } from 'contentful';
import _ from 'lodash';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

export default async function handler(req, res) {
  const { quiz } = req.body;

  const count = await client.getEntries({
    limit: 0,
    content_type: "question",
  });

  const data = await client.getEntries({
    include: 2,
    skip: _.random(0, count.total - 1),
    content_type: "question",
    "fields.skill.sys.id": quiz,
    select: ['fields.question', 'fields.incorrectAnswers', 'fields.correctAnswer', 'fields.enableSideView'].join(',')
  });

  const updated = {
    qid: data.items[0].sys.id,
    question: data.items[0].fields.question,
    answers: _.shuffle(data.items[0].fields.incorrectAnswers),
    enableSideView: data.items[0].fields.enableSideView
  };

  res.status(200).json(updated);
}
