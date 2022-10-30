import { Card, Image } from 'semantic-ui-react'
import Link from 'next/link';

export default function CourseCards({ courses }) {
    return (
        <Card.Group itemsPerRow={6}>
            {courses.map((course, i) => (
                <Link key={i} href={course.fields.slug}>
                    <Card key={course.sys.id}>
                        <Image src={course.fields.thumbnail
                            ? course.fields.thumbnail.fields.file.url
                            : (course.fields.subject.fields.icon ?
                                course.fields.subject.fields.icon.fields.file.url
                                : "")} />
                        <Card.Content>
                            <Card.Header>{course.fields.title}</Card.Header>
                        </Card.Content>
                    </Card>
                </Link>
            ))}
        </Card.Group>
    )
}