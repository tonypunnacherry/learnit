import Head from 'next/head';
import Link from 'next/link';

import { createClient } from 'contentful';
import { Button, Icon, Divider } from 'semantic-ui-react'

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

export async function getStaticPaths() {
    const res = await client.getEntries({
        include: 2,
        content_type: "lesson",
        select: ['sys.id'].join(',')
    });

    return {
        paths: res.items.map(item => ({ params: { lesson: item.sys.id } })),
        fallback: true,
    }
}

export async function getStaticProps({ params }) {
    const res = await client.getEntries({
        include: 2,
        content_type: "lesson",
        'sys.id': params.lesson
    });

    const lesson = res.items[0];

    return {
        props: {
            lesson: lesson,
            revalidate: 30
        }
    }

}

export default function Lesson({ lesson }) {
    return (
        <>
            <Head>
                <title>{"Learnit"}</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css" integrity="sha384-bYdxxUwYipFNohQlHt0bjN/LCpueqWz13HufFEV1SUatKs1cm4L6fFgCi1jT643X" crossOrigin="anonymous" />

                <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.js" integrity="sha384-Qsn9KnoKISj6dI8g7p1HBlNpVx0I8p1SvlwOldgi3IorMle61nQy4zEahWYtljaz" crossOrigin="anonymous"></script>

                <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossOrigin="anonymous"
                    onload="renderMathInElement(document.getElementById('lesson_content'));"></script>
            </Head>
            <div className="page_body">
                <Link href={"/"}>
                    <Button icon labelPosition='left'>
                        <Icon name='left arrow' />
                        Back
                    </Button>
                </Link>
                <h1>{lesson.fields.title}</h1>
                <Divider /> <br/>
                {/* HTML does not need to be sanitized because all content is trusted coming from our CMS - this is a safe procedure. */}
                <div id="lesson_content" dangerouslySetInnerHTML={{
                    __html: lesson.fields.content
                }}></div>
                <br/><br/>
            </div>
        </>
    )
}
