import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import './HomeCompo.css';
import { useNavigate } from 'react-router-dom';


const HomeCompo = () => {
    const navigate = useNavigate();
    const [wordData, setWordData] = useState({
        word: "",
        meaning: "",
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
            const response = await axios.post(`https://qz-var.vercel.app/api/user/add`, wordData, { headers });
            alert('Word added successfully!');
            setWordData({ word: "", meaning: "" }); // Clear the form
        } catch (error) {
            console.error(error);
            alert('Failed to add word. Please try again.');
        }
    };

    return (
        <div id="word-form">
            <h1>Add New Word</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="word">Word:</label>
                <TextField
                    required
                    variant="outlined"
                    type="text"
                    value={word}
                    onChange={handleInputChange("word")}
                    name="word"
                    id="word"
                    placeholder="Enter Word"
                    fullWidth
                />
                <label htmlFor="meaning">Meaning:</label>
                <TextField
                    required
                    variant="outlined"
                    type="text"
                    value={meaning}
                    onChange={handleInputChange("meaning")}
                    name="meaning"
                    id="meaning"
                    placeholder="Enter Meaning"
                    fullWidth
                />
                <Button variant="contained" type="submit" className="submit-button">Submit</Button>
               
            </form>
            <Button variant="contained" onClick={()=>{navigate("/quiz")}}> Quiz</Button>
        </div>
    );
};

export default HomeCompo;
