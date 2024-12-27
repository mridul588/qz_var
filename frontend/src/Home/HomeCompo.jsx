import React, { useEffect, useState } from 'react';
import { Button, TextField, Container, Box, Stack, Typography, Paper } from '@mui/material';
import axios from 'axios';
import './HomeCompo.css';
import { SignIn, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

// const API_URL = "http://localhost:5000/api/";
const API_URL = "https://qz-var.vercel.app/api/";

const HomeCompo = () => {
    const { isSignedIn, user } = useUser();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (user) {
            console.log(" user info ", user);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setWordData(prev => ({
                ...prev,
                userId: user.id
            }));
        }
    }, [user]);

    const [wordData, setWordData] = useState({
        word: "",
        meaning: "",
        userId: user?.id || ""
    });

    const { word, meaning } = wordData;

    const handleInputChange = (prop) => (event) => {
        setWordData({
            ...wordData,
            [prop]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!word || !meaning) {
            alert('Please fill in all fields.');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${API_URL}user/add`, wordData, { headers });
            alert('Word added successfully!');
            console.log('Payload:', wordData);
            setWordData({ word: "", meaning: "", userId: user.id });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data || 'Failed to add word. You may have already added this word.');
            } else {
                alert('Failed to add word. Please try again.');
            }
        }
    };

    if (!isSignedIn) {
        return <SignIn />;
    }

    return (
        <Container maxWidth="sm" className={darkMode ? 'dark-mode' : 'light-mode'}>
            <Box
                component={Paper}
                elevation={3}
                p={4}
                mt={4}
                sx={{ borderRadius: 2 }}
            >
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Add New Word
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            required
                            variant="outlined"
                            type="text"
                            value={word}
                            onChange={handleInputChange("word")}
                            label="Word"
                            placeholder="Enter Word"
                            fullWidth
                        />
                        <TextField
                            required
                            variant="outlined"
                            type="text"
                            value={meaning}
                            onChange={handleInputChange("meaning")}
                            label="Meaning"
                            placeholder="Enter Meaning"
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            fullWidth
                            size="large"
                            className="submit-button"
                        >
                            Submit
                        </Button>

                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            fullWidth
                            size="large"
                            onClick={() => {navigate("/public")}}
                        >
                            Use Public Words
                        </Button>
                    </Stack>
                </form>
                <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
                    <Button variant="contained" color="secondary" onClick={() => { navigate("/quiz") }}>
                        Quiz
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => { navigate("/flash") }}>
                        Blind
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => { navigate("/my-words") }}>
                        My Words
                    </Button>
                </Stack>
                
            </Box>
        </Container>
    );
};

export default HomeCompo;
