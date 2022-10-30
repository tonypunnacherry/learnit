import { Grid, Segment, Radio, Form, Button } from 'semantic-ui-react'
import { useState, useEffect } from 'react';

export default function Question({ quiz, currentQuestion, onVerify, user }) {
    const [data, setData] = useState(null);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleChange = (event, { value }) => setSelectedChoice(value);
    const handleSubmit = async () => {
        setLoading(true);
        const res = await fetch("/api/quiz/checkAnswer", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                question: data.qid, 
                answer: selectedChoice, 
                user: user, 
                quizId: quiz.sys.id, 
                questions: quiz.fields.questions, 
                currentQuestion: currentQuestion 
            })
        })
        const json = await res.json();
        onVerify(json.correct);
        setSelectedChoice(null);
    };

    const fetchData = async () => {
        const res = await fetch("/api/quiz/getQuestion", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ quizId: quiz.sys.id })
        })
        const myData = await res.json();
        setData(myData);
        setTimeout(() => setLoading(false), 100);
    };

    useEffect(() => {
        fetchData();
    }, [currentQuestion]);

    if (!data) return <p>Loading...</p>;

    return (
        <Grid divided='vertically'>
            <Grid.Row columns={data.enableSideView ? 2 : 1}>
                <Grid.Column>
                    <h4>Question {currentQuestion}</h4>
                    {/* HTML does not need to be sanitized because all content is trusted coming from our CMS - this is a safe procedure. */}
                    <p dangerouslySetInnerHTML={{
                        __html: data.question
                    }}></p>
                </Grid.Column>
                <Grid.Column style={{ paddingRight: 50 }}>
                    <br />
                    <Form onSubmit={handleSubmit}>
                        {data.answers.map((answer, i) => <Segment key={i} onClick={() => {if(!loading) {setSelectedChoice(answer)}}} style={{ cursor: "pointer" }}>
                            <Radio
                                name="choices"
                                value={answer}
                                label={answer}
                                checked={selectedChoice === answer}
                                style={{ width: "100%" }}
                                onChange={handleChange}
                                disabled={loading} />
                        </Segment>)}
                        <br />
                        <Button loading={loading} color="orange" type="submit">Check Answer</Button>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}