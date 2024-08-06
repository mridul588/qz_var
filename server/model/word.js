// models/Word.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const wordSchema = new Schema({
    word: { type: String, required: true, unique: true },
    meaning: { type: String, required: true },
});

const Word = mongoose.model('Word', wordSchema);

export default Word;
