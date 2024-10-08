import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import { SignIn, useUser } from '@clerk/clerk-react';
import '../QZ/Quiz.css';

import VolumeUpIcon from '@mui/icons-material/VolumeUp';
const API_URL = "http://localhost:5000/api/";
const FlashCard = () => {
    const { isSignedIn, user } = useUser();
    const [quizData, setQuizData] = useState(null);
    const [revealed, setRevealed] = useState(false); // State to control if meaning is revealed
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null); // To show result like "Correct" or "Incorrect"
     console.log(user);
    const fetchQuizData = async () => {
        setLoading(true);
        setRevealed(false);
        setResult(null);
        try {
            const response = await axios.post(`${API_URL}user/qz`, {
                userId: user.id
            });
            setQuizData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quiz data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizData();
    }, []);

    if (!isSignedIn) {
        return <SignIn />;
    }

  

    const handleReveal = () => {
        setRevealed(true);
    };

    const handleAnswer = async (isCorrect) => {
        try {
            const response = await axios.post(`${API_URL}user/submitAnswerFlash`, {
                wordId: quizData.wordId,
                isCorrect // Send the correct flag depending on the button clicked
            });
    
            const { correct, correctAnswer } = response.data;
            setResult(correct ? 'Correct!' : 'Incorrect!');
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
                    <VolumeUpIcon onClick={playPronunciation} style={{ cursor: 'pointer' }} />
                </Typography>

                {quizData ? (
                    <>
                        <Typography variant="h6" component="h2">
                            What is the meaning of the word: <strong>{quizData.word}</strong>?
                        </Typography>

                        {!revealed ? (
                            <Button variant="contained" color="primary" onClick={handleReveal} style={{ marginTop: '20px' }}>
                                Reveal Meaning
                            </Button>
                        ) : (
                            <>
                                <Typography variant="h6" component="p" style={{ marginTop: '20px' }}>
                                    Meaning: <strong>{quizData.correctAnswer}</strong>
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleAnswer(true)}
                                    style={{ marginRight: '10px', marginTop: '20px' }}
                                >
                                    Correct
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleAnswer(false)}
                                    style={{ marginTop: '20px' }}
                                >
                                    Incorrect
                                </Button>
                            </>
                        )}
                       
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={fetchQuizData}
                            style={{ marginTop: '20px' , marginLeft : '10px'}}
                        >
                            New Word
                        </Button>

                        {result && (
                            <Typography variant="h6" component="p" style={{ marginTop: '20px' }}>
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

export default FlashCard;
