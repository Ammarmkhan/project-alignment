import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/Registration';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Root reserved for login */}
          <Route path ="/" element={<SignUp/>} /> 
        </Routes> 
      </BrowserRouter>
    </div>
  );
};

export default App;
