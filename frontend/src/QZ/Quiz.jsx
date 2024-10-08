import React, { useState, useEffect } from 'react';
import { Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Typography, Container, Paper, CircularProgress } from '@mui/material';
import axios from 'axios'
import { SignIn, useUser } from '@clerk/clerk-react';
import './Quiz.css';

// const API_URL = "http://localhost:5000/api/";

const API_URL = "https://qz-var.vercel.app/api/";

import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const Quiz = () => {
    const { isSignedIn, user } = useUser();
    const [quizData, setQuizData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchQuizData();
    }, []);

    
    if (!isSignedIn) {
        return <SignIn />;
    }

    const fetchQuizData = async () => {
        setLoading(true);
        setSelectedOption('');
        setResult(null);
        try {
            const response = await axios.post(`${API_URL}user/qz`, {
                userId : user.id
            });
            setQuizData(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quiz data:', error);
            setLoading(false);
        }
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        console.log(selectedOption);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${API_URL}user/submitAnswer`, {
                wordId: quizData.wordId,
                selectedOption,
            });

            const { correct, correctAnswer } = response.data;
            setResult(correct ? 'Correct!' : `Incorrect! The correct answer was ${correctAnswer}`);
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    const playPronunciation = () => {
        if ('speechSynthesis' in window && quizData) {
            const utterance = new SpeechSynthesisUtterance(quizData.word);
            speechSynthesis.speak(utterance);
        } else {
            console.error('Speech Synthesis API not supported');
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} className="quiz-container">
                <Typography variant="h4" component="h1" gutterBottom>
                    Quiz App
                    <VolumeUpIcon
                            onClick={playPronunciation} 
                            style={{}}
                        /> 
                </Typography>
                {quizData ? (
                    <>
                        <Typography variant="h6" component="h2">
                            What is the meaning of the word: <strong>{quizData.word}</strong>?
                        </Typography>
                        
    

                        <FormControl component="fieldset">
                            <FormLabel component="legend">Choose the correct meaning</FormLabel>
                            <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                                {quizData.options.map((option, index) => (
                                    <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                                ))}
                            </RadioGroup>
                            <Button variant="contained" color="primary" onClick={handleSubmit} className="submit-button">
                                Submit
                            </Button>

                            <Button variant="contained" color="secondary" onClick={fetchQuizData} style={{ marginTop: '20px' }} className="new-question-button">
                                New Question
                            </Button>
                        </FormControl>
                        {result && (
                            <Typography variant="h6" component="p" className="result">
                                {result}
                            </Typography>
                        )}
                    </>
                ) : (
                    <Typography variant="h6" component="p">
                        No quiz data available.
                    </Typography>
                )}
            </Paper>
        </Container>
    );
};

export default Quiz;
