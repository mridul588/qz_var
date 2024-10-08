
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import HomeCompo from './Home/HomeCompo';
import  Quiz  from './QZ/Quiz';
import FlashCard from './Flash/FlashCard';
import MyWords from './MyWords/MyWords';

function App() {
  

  return (
    <>
    <div>
      <Routes>
        <Route path='/' element={<HomeCompo />}/>
        <Route path='/quiz' element={<Quiz />}/>
        <Route path="/my-words" element={<MyWords />} /> 
        <Route path='/flash' element={<FlashCard />} />
      </Routes>
    </div>
      
    </>
  )
}

export default App
