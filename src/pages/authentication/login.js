import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import Spinner from '../spinner';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import supabase from '../../config/supabaseClient';

export default function Login({setToken}) {
    const navigate = useNavigate();
    const [loginCred, setLoginCred] = useState({
        email: '',
        password: '',
    })
    const [isSpinner, setIsSpinner] = useState(false);
    const [err, setError] = useState({
        emailErr: '',
        passErr: ''
    })

    const onValueChange = (name, value) => {
        setLoginCred({ ...loginCred, [name]: value })
    }

    const submit = async(e) => {
        e.preventDefault();
        // Validate form fields
        const errors = {};
        if (!loginCred.email.trim()) {
            errors.emailErr = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(loginCred.email)) {
            errors.emailErr = 'Invalid email address';
        }
        if (!loginCred.password.trim()) {
            errors.passErr = 'Password is required';
        }

        if (Object.keys(errors).length > 0) {
            setError(errors);
        } else {
            setIsSpinner(true);
            setError();

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                  email: loginCred.email,
                  password: loginCred.password,
                });

                if (error) {
                  throw error;
                } else {
                  // Set login success
                  setToken(data);
                  setIsSpinner(false);
                  timer();
                }
              } catch (error) {
                setError({passErr: error.message})
                setIsSpinner(false);
              }
        }
    }

    const timer = () => {
            const selectedOption = localStorage.getItem('currentUser');
            switch (selectedOption) {
                case 'Applicants':
                  navigate('/tadash');
                  break;
                case 'Administrator':
                  navigate('/admindash');
                  break;
                case 'Commitee Members':
                  navigate('/com');
                  break;
                case 'Instructor':
                  navigate('/instructor-dashboard');
                  break;
                default:
                  break;
            }
            notifications.show({
                message: 'Login success!',
                color: 'teal',
                autoClose: 5000
            })
    }

    const user = localStorage.getItem('currentUser');
    return (
        <>
            {isSpinner && <Spinner />}
            <Title ta="center" fw="900">
                Welcome to {user} login
            </Title>
            <Container size={420} my={40}>
                {user === "Applicants" && <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Do not have an account yet?{' '}
                    <Anchor size="sm" component="button" onClick={() => navigate("/signup")}>
                        Create account
                    </Anchor>
                </Text>}

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput value={loginCred.email} onChange={(e) => onValueChange('email', e.currentTarget.value)} label="Email" placeholder="Enter your email" required error={err?.emailErr}/>
                    <PasswordInput value={loginCred.password} onChange={(e) => onValueChange('password', e.currentTarget.value)} label="Password" placeholder="Your password" required mt="md" error={err?.passErr} />
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Remember me" />
                        <Anchor component="button" size="sm" onClick={() => navigate("/forgot-password")}>
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button fullWidth bg="#0073e6" mt="xl" onClick={submit}>
                        Login
                    </Button>
                </Paper>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Landed in different Role?{' '}
                    <Anchor component="button" size="sm" onClick={() => navigate("/")}>
                        Click to change
                    </Anchor>
                </Text>
            </Container>
        </>
    );
}