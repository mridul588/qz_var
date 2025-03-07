
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import HomeCompo from './Home/HomeCompo';
import  Quiz  from './QZ/Quiz';
import FlashCard from './Flash/FlashCard';
import MyWords from './MyWords/MyWords';
import Public from './Public/Public';
import QuizPublic from './PublicCompo/QuizPublic/QuizPublic';
import FlashPublic from './PublicCompo/FlashPublic/FlashPublic';
import All from './PublicCompo/All/All';

function App() {
  

  return (
    <>
    <div>
      <Routes>
        <Route path='/' element={<HomeCompo />}/>
        <Route path='/quiz' element={<Quiz />}/>
        <Route path="/my-words" element={<MyWords />} /> 
        <Route path='/flash' element={<FlashCard />} />
        <Route path='/public' element={<Public />} />
        <Route path='/qp' element={<QuizPublic />} />
        <Route path='/fp' element={<FlashPublic />} />
        <Route path='/all' element={<All />} />
      </Routes>
    </div>
      
    </>
  )
}

export default App
