import React from 'react'
import { BrowserRouter, Route, Routes }
from 'react-router-dom'
import Landing from './pages/landing'
import About from './pages/about'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>

      <Route path="/" element={<Landing />} />
      <Route path="/About" element={<About />} />
      


  
    </Routes>

    </BrowserRouter>
  )
}


export default App