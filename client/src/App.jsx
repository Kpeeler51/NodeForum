import './App.css'
import {BrowserRouter, Route, Routes } from 'react-router';
import Home from './Components/Home/Home'
import Navbar from './Components/Navbar/Navbar'

function App() {

  return (
    <div>
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App
