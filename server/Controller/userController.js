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
  // const qz = asyncHandler(async (req, res) => {
  //   try {
  //     const words = await Word.aggregate([{ $sample: { size: 1 } }]);
  //     if (!words.length) return res.status(404).send('No words found');
  
  //     const correctWord = words[0];
  //     const incorrectOptions = await Word.aggregate([
  //       { $match: { _id: { $ne: correctWord._id } } },
  //       { $sample: { size: 3 } },
  //     ]);
  
  //     const options = [correctWord.meaning, ...incorrectOptions.map(opt => opt.meaning)];
  //     const shuffledOptions = options.sort(() => 0.5 - Math.random());
  
  //     res.json({ word: correctWord.word, options: shuffledOptions, correctAnswer: correctWord.meaning });
  //   } catch (error) {
  //     res.status(500).send('Error fetching quiz data: ' + error.message);
  //   }
  // });
  const updateWordPerformance = async (wordId, correct) => {
    if (correct) {
        await Word.findByIdAndUpdate(wordId, { $inc: { correctCount: 1 } });
    } else {
        await Word.findByIdAndUpdate(wordId, { $inc: { incorrectCount: 1 } });
    }
};


const submitAnswer = asyncHandler(async (req, res) => {
    try {
        const { wordId, selectedOption } = req.body;
        const word = await Word.findById(wordId);

        if (!word) return res.status(404).send('Word not found');

        const correct = word.meaning === selectedOption;
        await updateWordPerformance(wordId, correct);

        res.json({ correctAnswer: word.meaning, correct });
    } catch (error) {
        res.status(500).send('Error submitting answer: ' + error.message);
    }
});

const qz = asyncHandler(async (req, res) => {
  try {
      // Calculate total weight for all words
      const words = await Word.find();
      const totalWeight = words.reduce((sum, word) => sum + word.incorrectCount + 1, 0);

      // Randomly select a word based on weight
      let random = Math.random() * totalWeight;
      let selectedWord;
      for (const word of words) {
          random -= word.incorrectCount + 1;
          if (random <= 0) {
              selectedWord = word;
              break;
          }
      }

      if (!selectedWord) return res.status(404).send('No words found');

      const incorrectOptions = await Word.aggregate([
          { $match: { _id: { $ne: selectedWord._id } } },
          { $sample: { size: 3 } },
      ]);

      const options = [selectedWord.meaning, ...incorrectOptions.map(opt => opt.meaning)];
      const shuffledOptions = options.sort(() => 0.5 - Math.random());

      res.json({ word: selectedWord.word, options: shuffledOptions, correctAnswer: selectedWord.meaning, wordId: selectedWord._id });
  } catch (error) {
      res.status(500).send('Error fetching quiz data: ' + error.message);
  }
});



  export {addWord , qz , submitAnswer};