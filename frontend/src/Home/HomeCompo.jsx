import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import axios from 'axios';
import './HomeCompo.css';
import { SignIn, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const HomeCompo = () => {
    const { isSignedIn, user } = useUser(); // Get user info from Clerk
    const navigate = useNavigate();

    // Log user info when user is available
    useEffect(() => {
        if (user) {
            console.log("User info: ", user);
        }
    }, [user]);

    // State for word and meaning, userId is handled separately when user is available
    const [wordData, setWordData] = useState({
        word: "",
        meaning: ""
    });

    // Update wordData when user is available
    useEffect(() => {
        if (user) {
            setWordData(prev => ({
                ...prev,
                userId: user.id // Add userId when user is available
            }));
        }
    }, [user]);

    // Destructure word and meaning for easier access
    const { word, meaning } = wordData;

    // Handle input change for form fields
    const handleInputChange = (prop) => (event) => {
        setWordData({
            ...wordData,
            [prop]: event.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!word || !meaning) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const headers = { 'Content-Type': 'application/json' };
            const response = await axios.post('https://qz-var.vercel.app/api/user/add', wordData, { headers });
            
            alert('Word added successfully!');
            console.log('Payload:', wordData);

            // Reset the form, keeping the userId
            setWordData({ word: "", meaning: "", userId: user.id });

        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Alert if a duplicate word is being added by the same user
                alert(error.response.data || 'Failed to add word. You may have already added this word.');
            } else {
                alert('Failed to add word. Please try again.');
            }
        }
    };

    // Show the SignIn component if the user is not signed in
    if (!isSignedIn) {
        return <SignIn />;
    }

    return (
        <div>
          

            {/* Word Form */}
            <Box id="word-form" sx={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
                <Typography variant="h4" gutterBottom>Add New Word</Typography>
                <Typography variant="body1" gutterBottom>
                    Enter a word and its meaning to add to your vocabulary list.
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        required
                        variant="outlined"
                        type="text"
                        label="Word"
                        value={word}
                        onChange={handleInputChange("word")}
                        placeholder="Enter Word"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        required
                        variant="outlined"
                        type="text"
                        label="Meaning"
                        value={meaning}
                        onChange={handleInputChange("meaning")}
                        placeholder="Enter Meaning"
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" type="submit" sx={{ mt: 2 }}>Submit</Button>
                </form>
                
                {/* Quiz Button */}
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/quiz")}>
                    Quiz
                </Button>
            </Box>
        </div>
    );
};

export default HomeCompo;
