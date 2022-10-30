import { Sidebar, Menu, Segment, Icon, Image } from 'semantic-ui-react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';

export default function Layout({ children }) {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <Sidebar.Pushable>
            <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                vertical
                visible
                color="green"
            >
                <Menu.Item>
                    <Image src={user?.picture || "https://static.thenounproject.com/png/672168-200.png"} avatar size="mini" />
                </Menu.Item>
                <Link href="/">
                    <Menu.Item>
                        <Icon name='home' />
                        Home
                    </Menu.Item>
                </Link>
                <Link href="/library">
                    <Menu.Item>
                        <Icon name='book' />
                        Library
                    </Menu.Item>
                </Link>
                {user && <Link href="/friends">
                    <Menu.Item>
                        <Icon name='group' />
                        Friends
                    </Menu.Item>
                </Link>}
                {user ? <Link href="/api/auth/logout">
                    <Menu.Item>
                        <Icon name='user' />
                        Logout
                    </Menu.Item>
                </Link> : <Link href="/api/auth/login">
                    <Menu.Item>
                        <Icon name='user' />
                        Login
                    </Menu.Item>
                </Link>}
            </Sidebar>

            <Sidebar.Pusher>
                <Segment basic style={{padding: 0, paddingLeft: 84}}>
                    <main>{children}</main>
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
}