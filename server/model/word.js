// models/Word.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const wordSchema = new Schema({
    word: { type: String, required: true, unique: true },
    meaning: { type: String, required: true },
    correctCount: { type: Number, default: 0 }, 
    incorrectCount: { type: Number, default: 0 },
    userId: { type: String, required: true }, // for the user 
});

const Word = mongoose.model('Word', wordSchema);

export default Word;
