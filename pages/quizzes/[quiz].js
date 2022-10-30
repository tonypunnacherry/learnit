import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import _ from 'lodash';

import { createClient } from 'contentful';
import { Button, Icon, Label, Loader, Dimmer } from 'semantic-ui-react'

import Question from '../../components/question'

import { useUser } from '@auth0/nextjs-auth0';

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

export async function getStaticPaths() {
    const res = await client.getEntries({
        include: 2,
        content_type: "quiz",
        select: ['sys.id'].join(',')
    });

    return {
        paths: res.items.map(item => ({ params: { quiz: item.sys.id } })),
        fallback: true,
    }
}

export async function getStaticProps({ params }) {
    const res = await client.getEntries({
        include: 2,
        content_type: "quiz",
        'sys.id': params.quiz
    });

    const quiz = res.items[0];

    return {
        props: {
            quiz: quiz,
            revalidate: 30
        }
    }

}

// TODO: Auto-load question progress if quiz not completed in last session

export default function Quiz({ quiz }) {
    const { user, error, isLoading } = useUser();

    const [loading, setLoading] = useState(false);
    const [correct, setCorrect] = useState(new Array(quiz.fields.questions).fill(0));
    const [questionNumber, setQuestionNumber] = useState(1);
    const [finished, setFinished] = useState(-1);

    useEffect(() => {
        fetchData();
    }, [finished]);

    const fetchData = async () => {
        if (!user || finished >= 0) return;
        const res = await fetch("/api/quiz/getProgress", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ user: user.sub, quiz: quiz })
        })
        const myData = await res.json();
        setCorrect(myData.correct);
        setQuestionNumber(myData.correct.filter(val => val !== 0).length + 1);
        setLoading(false);
    };

    const handleVerify = val => {
        let newCorrect = correct;
        if (val) newCorrect[questionNumber - 1] = 1;
        else newCorrect[questionNumber - 1] = -1;
        setCorrect(newCorrect);
        if (questionNumber == quiz.fields.questions) {
            finishQuiz();
        } else {
            setQuestionNumber(questionNumber + 1);
        }
    };

    const finishQuiz = async () => {
        setLoading(true);
        if (user) {
            const res = await fetch("/api/quiz/getScore", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ user: user.sub, quizId: quiz.sys.id })
            })
            const json = await res.json();
            setCorrect(json.correct);
        }
        setFinished(correct.filter(val => val == 1).length)
        setLoading(false);
    }
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <>
            <Head>
                <title>{"Learnit"}</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css" integrity="sha384-bYdxxUwYipFNohQlHt0bjN/LCpueqWz13HufFEV1SUatKs1cm4L6fFgCi1jT643X" crossOrigin="anonymous" />
                <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.js" integrity="sha384-Qsn9KnoKISj6dI8g7p1HBlNpVx0I8p1SvlwOldgi3IorMle61nQy4zEahWYtljaz" crossOrigin="anonymous"></script>
                <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossOrigin="anonymous"
                    onload="renderMathInElement(document.getElementById('question'));"></script>
            </Head>
            <div className="page_body">
                <Link href={"/"}>
                    <Button icon labelPosition='left'>
                        <Icon name='left arrow' />
                        Back
                    </Button>
                </Link>
                <div class="ui clearing segment">
                    <div class="ui right floated header">
                        {_.times(quiz.fields.questions, (i) => <Icon 
                            name={correct[i] == 1 ? "check circle" : (correct[i] == -1 ? "times circle" : "circle outline")}
                            color={correct[i] == 1 ? "green" : (correct[i] == -1 ? "red" : "grey")} />)}
                    </div>
                    <h3 class="ui left floated header">
                        Quiz: {quiz.fields.title}
                        <Label>{quiz.fields.questions} questions</Label>
                    </h3>
                </div>
                <br />
                <div id="question">
                    {finished < 0 
                        ? <Question quiz={quiz} currentQuestion={questionNumber} onVerify={handleVerify} user={user?.sub} />
                        : (loading
                            ? <Dimmer active inverted>
                            <Loader size='large'>Loading</Loader>
                            </Dimmer>
                            : <>
                            <h2>Congratulations!</h2>
                            <p>You scored {finished}/{quiz.fields.questions}!</p>
                            <br/>
                            <Button color="orange" onClick={()=>{
                                setCorrect([]);
                                setQuestionNumber(1);
                                setFinished(-1);}}>Retake Quiz</Button>
                        </>)}
                </div>
            </div>
        </>
    )
}
