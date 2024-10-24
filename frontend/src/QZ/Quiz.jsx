import React, { useState, useEffect } from 'react';
import {
    Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Typography,
    Container, Paper, CircularProgress, Stack, Box
} from '@mui/material';
import axios from 'axios';
import { SignIn, useUser } from '@clerk/clerk-react';
import './Quiz.css';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// const API_URL = "http://localhost:5000/api/";
const API_URL = "https://qz-var.vercel.app/api/";

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
                userId: user.id
            });
            setQuizData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quiz data:', error);
            setLoading(false);
        }
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
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
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" style={{ paddingTop: '20px' }}>
            <Paper elevation={3} className="quiz-container" sx={{ p: 4, borderRadius: 2 }}>
                {quizData ? (
                    <>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h4" component="h1">
                                Quiz Time!
                            </Typography>
                            <VolumeUpIcon
                                onClick={playPronunciation}
                                sx={{ cursor: 'pointer', fontSize: 30, color: '#3f51b5' }}
                            />
                        </Stack>
                        <Typography variant="h6" component="h2" mt={2}>
                            What is the meaning of the word: <strong>{quizData.word}</strong>?
                        </Typography>

                        <FormControl component="fieldset" sx={{ mt: 3 }}>
                            <FormLabel component="legend">Choose the correct meaning</FormLabel>
                            <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                                {quizData.options.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        value={option}
                                        control={<Radio />}
                                        label={option}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        <Stack direction="row" spacing={2} mt={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit}
                                className="submit-button"
                                sx={{
                                    bgcolor: '#3f51b5',
                                    '&:hover': { bgcolor: '#303f9f' }
                                }}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={fetchQuizData}
                                sx={{
                                    bgcolor: '#f50057',
                                    '&:hover': { bgcolor: '#c51162' }
                                }}
                            >
                                New Question
                            </Button>
                        </Stack>

                        {result && (
                            <Typography
                                variant="h6"
                                component="p"
                                className="result"
                                sx={{
                                    mt: 3,
                                    color: result.startsWith('Correct') ? 'green' : 'red',
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                            >
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
