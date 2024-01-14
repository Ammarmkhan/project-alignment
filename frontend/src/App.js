import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import { CookiesProvider } from 'react-cookie';
import { useState } from 'react';
import Dashboard from './components/Dashboard';

function App() {

  return (
    <div className="App">
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path ="/" element={<Login/>} /> 
            <Route path ="/signup" element={<SignUp/>} /> 
            <Route path ="/login" element={<Login/>} />
            <Route path ="/dashboard" element={<Dashboard/>} />
          </Routes> 
        </BrowserRouter>
      </CookiesProvider>      
    </div>
  );
};

export default App;
