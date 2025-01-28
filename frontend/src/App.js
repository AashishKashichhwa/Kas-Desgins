import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Projects from './pages/Project';
import Contact from './pages/Contact';
import './assets/styles/style.css';


function App() {
  return (
      <Router>
          <Routes>
             <Route path="/projects" element={<Projects />} />
             <Route path="/contact" element={<Contact />} />
         </Routes>
     </Router>
   );
}
export default App;