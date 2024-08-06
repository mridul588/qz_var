import asyncHandler from 'express-async-handler';
import Word from '../model/word.js';

const addWord = asyncHandler(async (req, res) => {
    const { word, meaning } = req.body;
    try {
      const newWord = new Word({ word, meaning });
      await newWord.save();
      res.status(201).send('Word added successfully!');
    } catch (error) {
      res.status(400).send('Error adding word: ' + error.message);
    }
  });
  
  // API endpoint to fetch quiz data
  const qz = asyncHandler(async (req, res) => {
    try {
      const words = await Word.aggregate([{ $sample: { size: 1 } }]);
      if (!words.length) return res.status(404).send('No words found');
  
      const correctWord = words[0];
      const incorrectOptions = await Word.aggregate([
        { $match: { _id: { $ne: correctWord._id } } },
        { $sample: { size: 3 } },
      ]);
  
      const options = [correctWord.meaning, ...incorrectOptions.map(opt => opt.meaning)];
      const shuffledOptions = options.sort(() => 0.5 - Math.random());
  
      res.json({ word: correctWord.word, options: shuffledOptions, correctAnswer: correctWord.meaning });
    } catch (error) {
      res.status(500).send('Error fetching quiz data: ' + error.message);
    }
  });

  export {addWord , qz};