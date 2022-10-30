import { Input, Form, TextArea, Button } from 'semantic-ui-react'

export default function Question({ question, user }) {
    if (question.type == "term") {
        return (<>
            <p>{question.definition}</p>
            <Input placeholder="Enter the term" /> <Button color="orange">Check Answer</Button>
        </>);
    } else if (question.type == "self_graded") {
        return (<>
            <p>{question.prompt}</p>
            <Form>
                <TextArea placeholder="Write your best answer in this box" />
                <br /><br />
                <Button color="orange">Check Answer</Button>
            </Form>
        </>);
    } else {
        return (<>
            <p>Error</p>
        </>);
    }
}