import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner";
import supabase from "../../config/supabaseClient";

export default function Signup() {
    const navigate = useNavigate();
    const [details, setDetails] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [err, setError] = useState({
        nameErr: '',
        emailErr: '',
        passErr: '',
        confErr: ''
    })
    const [isSpinner, setIsSpinner] = useState(false)

    const onValueChange = (name, value) => {
        setDetails({ ...details, [name]: value })
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        // Validate form fields
        const errors = {};
        if (!details.name.trim()) {
            errors.nameErr = 'name is required';
        }
        if (!details.email.trim()) {
            errors.emailErr = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(details.email)) {
            errors.emailErr = 'Invalid email address';
        }
        if (!details.password.trim()) {
            errors.passErr = 'Password is required';
        }
        if (details.password.trim() !== details.confirmPassword.trim()) {
            errors.confErr = 'Passwords does not match';
        }

        if (Object.keys(errors).length > 0) {
            setError(errors);
        } else {
            setIsSpinner(true);
            setError();
            // Form is valid, proceed with submission
            try {
                const { data, error } = await supabase.auth.signUp({
                  email: details.email,
                  password: details.password,
                  options: {
                    data: {
                      fullName: details.name,
                    //   role: selectedOption // Assuming role will be stored in user data
                    }
                  }
                });
                
                if (error) {
                  throw error;
                } else {
                  setIsSpinner(false);
                  timer();
                }
              } catch (error) {
                setIsSpinner(false);
                setError({confErr: error.message})
              }
        }
    }

    const timer = () => {
        navigate("/login");
            notifications.show({
                message: 'Account created successfully! Redirecting to login page',
                color: 'teal',
                autoClose: 5000,
                position: 'top-center'
            })
    }

    return (
        <>
        {isSpinner && <Spinner />}
        <Container size={520} my={40}>
            <Title
                align="center"
                fw="900"
            >
                Create an Account
            </Title>


            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Stack>
                    <TextInput value={details.name} onChange={(e) => onValueChange('name', e.currentTarget.value)} label="Name" placeholder="Name" required error={err?.nameErr} />
                    <TextInput value={details.email} onChange={(e) => onValueChange('email', e.currentTarget.value)} label="Email" placeholder="Your email id" required error={err?.emailErr} />
                    <PasswordInput
                        value={details.password}
                        onChange={(e) => onValueChange('password', e.currentTarget.value)}
                        label="Password"
                        placeholder="Your password"
                        required
                        error={err?.passErr}
                    />
                    <PasswordInput
                        value={details.confirmPassword}
                        onChange={(e) => onValueChange('confirmPassword', e.currentTarget.value)}
                        label="Confirm password"
                        required
                        error={err?.confErr}
                    />
                </Stack>
                <Button fullWidth mt="xl" onClick={onSubmit}>
                    Sign Up
                </Button>
                <Text c="dimmed" size="sm" align="center" mt={10}>
                    Already have an account ?{" "}
                    <Anchor
                        size="sm"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </Anchor>
                </Text>
            </Paper>
        </Container>
        </>
    );
}