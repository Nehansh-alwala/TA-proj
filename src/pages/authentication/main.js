import React from 'react';
import { Card, Flex, Group, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import applicant from "../../assets/applicant.png";
import admin from "../../assets/admin.png";
import commitee from "../../assets/commitee_member.png";
import instructor from "../../assets/instructor.png";
import "./main.css";

export default function Home() {
    const cards = [
        {
            "img": applicant,
            "title": "Applicants"
        },
        {
            "img": admin,
            "title": "Administrator"
        },
        {
            "img": commitee,
            "title": "Commitee Members"
        },
        {
            "img": instructor,
            "title": "Instructor"
        }
    ];
    const navigate = useNavigate();

    return (
        <div>
            <Text ta="center" fw="bold" fz={30}>Tell us who's here Today!</Text>
            <Group pt={5} className='card_group' pb={5} m={20} gap="xl" style={{ filter: 'drop-shadow(0px 0px 7px #4a9cb9)' }}>
                {cards.map((cards, idx) => (
                    <Card ta="center" key={cards.title} pt={3} w={280} h={250} style={{ justifyContent: "space-between" }}
                        onClick={() => {
                            navigate("/login");
                            localStorage.setItem('currentUser', cards.title)
                        }}
                        className="card cursor_pointer"
                    >
                        <Card.Section>
                            <img
                                src={cards.img}
                                alt={cards.title}
                                height="200"
                                width="100%"
                            />
                        </Card.Section>
                        <Flex fz={18} fw="bold" align="center" justify="space-between">
                            {cards.title} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" /></svg>
                        </Flex>
                    </Card>
                ))}
            </Group>
        </div>
    )
}