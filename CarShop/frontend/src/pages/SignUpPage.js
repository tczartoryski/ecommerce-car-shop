import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useState} from "react";
import {authenticate} from "../authentication";
import InputTextField from "../components/InputTextField";

const apiUrl = 'http://127.0.0.1:8000/api/register/';
export default function SignUpPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password1: '',
        password2: '',
    });

    const textFields = [
        { id: "firstName", label: "First Name", sm: 6 },
        { id: "lastName", label: "Last Name", sm: 6 },
        { id: "email", label: "Email Address", sm: 12 },
        { id: "password1", label: "Password", sm: 12, type: "password" },
        { id: "password2", label: "Re-Enter Password", sm: 12, type: "password" },
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // User was successfully registered, you can redirect or show a success message.
                console.log('User registered successfully');
                const data = await response.json();
                authenticate(data);
                navigate('/market');
            } else {
                // Handle registration errors, display error messages, etc.
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {textFields.map((inputProps) => (
                                <Grid item xs={12} sm={inputProps.sm} key={inputProps.id}>
                                    <InputTextField
                                        onChange={handleChange}
                                        id={inputProps.id}
                                        label={inputProps.label}
                                        type={inputProps.type}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
    );
}