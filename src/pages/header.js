import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/owl.png"
import { Avatar, Burger, Group, Menu, Text, UnstyledButton } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export default function Header({ token, setToken }) {
    const navigate = useNavigate();
    const [opened, { toggle }] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const currentUser = localStorage.getItem('currentUser');

    return (
        <div className="header">
            <div className="section">
                <div className="logo-header">
                    <div className="logo">
                        <img src={logo} alt="FAU logo" width="100%" />
                    </div>
                    <div className="title">FLORIDA ATLANTIC UNIVERSITY</div>
                </div>
                {token &&
                    <Group c="white">
                        {currentUser === 'Applicants' ?
                        <>
                        <span className="cursor" onClick={() => navigate('/tadash')}>Home</span>
                        <span className="cursor" onClick={() => navigate('/taapplication')}>Applications</span>
                        </> : 
                        currentUser === 'Administrator' ? 
                        <>
                        <span className="cursor" onClick={() => navigate('/admindash')}>Home</span>
                        <span className="cursor" onClick={() => navigate('/addCourses')}>Add Courses</span>
                        <span className="cursor" onClick={() => navigate('/recom')}>TA recommendations</span>
                        </> :  
                        currentUser === 'Commitee Members' ? <span></span> :
                        <span></span>}
                        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
                        <Menu
                            width="inherit"
                            position="bottom-end"
                            transitionProps={{ transition: 'pop-top-right' }}
                            onClose={() => setUserMenuOpened(false)}
                            onOpen={() => setUserMenuOpened(true)}
                            withinPortal
                        >
                            <Menu.Target>
                                <UnstyledButton
                                    m={0}
                                // className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                                >
                                    <Group gap={1}>
                                        <Avatar color="white" alt={token.user.user_metadata.fullName} radius="xl" size="md" />
                                        <Text fw={500} size="sm" mr={3} style={{
                                            maxWidth: '80px',
                                            textOverflow: 'ellipsis', overflow: 'hidden'
                                        }}
                                            title={token.user.user_metadata.fullName}>
                                            {token?.user?.user_metadata?.fullName}
                                        </Text>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-down" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M6 9l6 6l6 -6" />
                                        </svg>
                                    </Group>
                                </UnstyledButton>
                            </Menu.Target>
                            <Menu.Dropdown w={150} style={{ zIndex: '1000', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)' }}>
                                <Menu.Item
                                    m={0}
                                    onClick={() => navigate('/profile')}
                                    leftSection={
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-edit" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
                                            <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
                                        </svg>
                                    }
                                >
                                    Profile
                                </Menu.Item>
                                <Menu.Item
                                    m={0}
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        setToken('');
                                        navigate('/')
                                    }}
                                    leftSection={
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-logout" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                            <path d="M9 12h12l-3 -3" />
                                            <path d="M18 15l3 -3" />
                                        </svg>
                                    }
                                >
                                    Logout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                }
            </div>
        </div>
    )
}