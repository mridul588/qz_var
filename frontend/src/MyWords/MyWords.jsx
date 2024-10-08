// MyWords.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyWords.css';
import { useUser } from '@clerk/clerk-react';
import { CircularProgress, Button } from '@mui/material';

// const API_URL = "http://localhost:5000/api/";
const API_URL = "https://qz-var.vercel.app/api/";


const MyWords = () => {
    const { user } = useUser();
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revealedWords, setRevealedWords] = useState({}); // Track revealed words

    useEffect(() => {
        const fetchWords = async () => {
            if (user) {
                try {
                    const response = await axios.get(`${API_URL}user/words/${user.id}`);
                    setWords(response.data);
                } catch (error) {
                    console.error('Error fetching words:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchWords();
    }, [user]);

    const handleReveal = (word) => {
        setRevealedWords(prev => ({
            ...prev,
            [word]: !prev[word] // Toggle reveal state for the word
        }));
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Word</th>
                        <th>Meaning</th>
                    </tr>
                </thead>
                <tbody>
                    {words.map((wordObj, index) => (
                        <tr key={index}>
                            <td>
                                <strong>{wordObj.word}</strong>
                            </td>
                            <td>
                                <Button variant="contained" onClick={() => handleReveal(wordObj.word)}>
                                    {revealedWords[wordObj.word] ? 'Hide Meaning' : 'Reveal Meaning'}
                                </Button>
                                {revealedWords[wordObj.word] && <div>{wordObj.meaning}</div>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyWords;
