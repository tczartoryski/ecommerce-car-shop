import * as React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import {ReactComponent as CarIcon} from '../assets/car-icon.svg'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState} from "react";
import { request} from "../authentication";
import InputTextField from "../components/InputTextField";


const apiUrl = '/api/car/create/';
export default function AddCarPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        price: '',
        location: '',
        description: '',
        image: null,
    });

    const inputFields = [
        { id: "make", label: "Make", sm: 6 },
        { id: "model", label: "Model", sm: 6 },
        { id: "year", label: "Year", sm: 6 },
        { id: "price", label: "Price", sm: 6 },
        { id: "location", label: "Location", sm: 12 },
        { id: "description", label: "Description", sm: 12, type: "description" },
    ];

    const handleChange = (event) => {
        const { name, value, files } = event.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'image' ? files[0] : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formPayload = new FormData();

            for (const key in formData) {
                formPayload.append(key, formData[key]);
            }

            const response = await request(apiUrl, {
                method: 'POST',
                body: formPayload,
            });

            if (response.ok) {
                console.log('Car created successfully');
                navigate('/my-cars');
            } else {
                console.error('Car creation failed');
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
                        <CarIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Car
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {inputFields.map((inputProps) => (
                                <Grid item xs={12} sm={inputProps.sm} key={inputProps.id}>
                                    <InputTextField
                                        onChange={handleChange}
                                        id={inputProps.id}
                                        label={inputProps.label}
                                        type={inputProps.type}
                                    />
                                </Grid>
                            ))}
                            <Grid item xs={12}>
                                <label>
                                    Upload Image: <input name="image" type="file" accept="image/*" onChange={handleChange} />
                                </label>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Container>
    );
}