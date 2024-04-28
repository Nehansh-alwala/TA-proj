import {
    Paper,
    Title,
    Text,
    TextInput,
    Button,
    Container,
    Group,
    Anchor,
    Center,
    Box,
    rem,
    Notification,
    Stack,
    PasswordInput,
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../spinner';
import { notifications } from '@mantine/notifications';

export default function ForgotPassword() {
    const [currentState, setCurrentState] = useState(0);
    const navigate = useNavigate();
    const [isSpinner, setIsSpinner] = useState(false);
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState({
        emailErr: '',
        passErr: ''
    })

    const submit = (e) => {
        e.preventDefault();
        const errors = {};
        if (currentState === 0) {
            if (!credentials.email.trim()) {
                errors.emailErr = 'Email is required';
            } else if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
                errors.emailErr = 'Invalid email address';
            } else {
                timer();
                setCurrentState(1);
            }
        } else {
            if (credentials.password.trim() === credentials.confirmPassword.trim()) {
                timer();
            } else {
                errors.passErr = 'Passwords does not match';
            }
        }

        if (Object.keys(errors).length > 0) {
            setError(errors);
        }
    }

    const timer = () => {
        setIsSpinner(true);
        setTimeout(() => {
            setIsSpinner(false);
            notifications.show({
                message: 'Password reset is successful! redirecting to login page',
                color: 'teal',
                autoClose: 5000,
                onClose: () => navigate("/login")
            })
        }, 5000)
    }

    const onValueChange = (name, value) => {
        setCredentials({ ...credentials, [name]: value })
    }

    return (
        <>
            {isSpinner && <Spinner />}
            <Container size={460} my={30}>
                <Title ta="center">
                    Forgot your password?
                </Title>
                <Text c="dimmed" fz="sm" ta="center" mt="sm">
                    Enter your email to reset your password
                </Text>

                <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                    {currentState === 0 ? <TextInput label="Email" value={credentials.email} onChange={(e) => onValueChange('email', e.currentTarget.value)} placeholder="Enter your email" required error={error.emailErr} /> :
                        <Stack>
                            <PasswordInput value={credentials.password} onChange={(e) => onValueChange('password', e.currentTarget.value)} label="New Password" placeholder="Enter new password" required error={error.passErr === "Passwords does not match"} />
                            <PasswordInput value={credentials.confirmPassword} onChange={(e) => onValueChange('confirmPassword', e.currentTarget.value)} label="Confirm Password" required error={error.passErr} />
                        </Stack>
                    }
                    <Group justify="space-between" mt="lg">
                        <Anchor c="dimmed" size="sm" onClick={() => navigate("/login")}>
                            <Center inline>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
                                <Box ml={5}>Back to the login page</Box>
                            </Center>
                        </Anchor>
                        <Button disabled={(currentState === 0 && !credentials.email) || (currentState === 1 && !credentials.password)
                            || (currentState === 1 && !credentials.confirmPassword)} onClick={submit}>{currentState === 0 ? 'Submit' : 'Reset password'}</Button>
                    </Group>
                </Paper>
            </Container>
        </>
    );
}