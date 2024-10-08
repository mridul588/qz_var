import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from "./routes/userRoutes.js"


import cors from 'cors';


const app = express();

dotenv.config();

const PORT = 5000;

connectDB();

app.use(cors('*'));
app.use(express.json());


// Route handlers
app.use("/api/user",userRoutes);




app.listen(PORT, () => {
    console.log(`Server running on port number :  ${PORT}`);
  })