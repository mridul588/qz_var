import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import axios from 'axios';
import './HomeCompo.css';
import { SignIn, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';


const HomeCompo = () => {

    const { isSignedIn, user } = useUser();

    const navigate = useNavigate();
   
    //USE EFFECT TO LOG IN USER INFO : 
    useEffect(() => {
        if(user){
            console.log(" user info ", user);
        }
    }, [user]); 

    useEffect(() => {
    if (user) {
        setWordData(prev => ({
            ...prev,
            userId: user.id // Update userId when user is available
        }));
    }
}, [user]);

    const [wordData, setWordData] = useState({
        word: "",
        meaning: "",
       userId: user?.id || "" 
       //user's userID from CLERK []
    });
    

    const { word, meaning } = wordData; //object destructuring, did this to get the word and the meanig from wordData object;

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
            console.log('Payload:', wordData);

            setWordData({ word: "", meaning: "", userId : user.id}); // Clear the form, but userID ko hatane ki zarurat nahi hai: 

        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Show alert if the user tries to add a duplicate word
                alert(error.response.data || 'Failed to add word. You may have already added this word.');
            } else {
                alert('Failed to add word. Please try again.');
            }
        }
    };

     // Return SignIn component if not signed in
     if (!isSignedIn) {
        return <SignIn />;
     }

    return (
        <div >

      
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
        </div>
    );
};

export default HomeCompo;
