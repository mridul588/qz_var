// MyWords.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyWords.css';
import { useUser } from '@clerk/clerk-react';
import { CircularProgress } from '@mui/material';

// const API_URL = "http://localhost:5000/api/";
const API_URL = "https://qz-var.vercel.app/api/"

const MyWords = () => {
    const { user } = useUser();
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);

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
                            <td><strong>{wordObj.word}</strong></td>
                            <td> <h4 style={{color: "black"}}>{wordObj.meaning}</h4></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyWords;
