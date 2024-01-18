import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import { CookiesProvider } from 'react-cookie';
import { useState, createContext } from 'react';
import Dashboard from './components/Dashboard';
import Integrations from './components/Integrations';
import Saved from './components/Saved';
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useLocation } from 'react-router-dom';




function MainContent({ isSidebar, setIsSidebar }) {

  // Check if the current route is not login or signup
  const location = useLocation();
  const showSidebarAndTopbar = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <div className="app">
      {showSidebarAndTopbar && <Sidebar isSidebar={isSidebar} />}
      <main className="content">
        {showSidebarAndTopbar && <Topbar setIsSidebar={setIsSidebar} />}
        <CookiesProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/saved" element={<Saved />} />
          </Routes>
        </CookiesProvider>
      </main>
    </div>
  );
}

// For main text input
export const WorkoutContext = createContext();


function App() {
  // For theme and sidebar toggling
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  // For main text input
  const [selectedWorkout, setSelectedWorkout] = useState('');

  return (
    <BrowserRouter>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <WorkoutContext.Provider value={{ selectedWorkout, setSelectedWorkout }}>
            <MainContent isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
          </WorkoutContext.Provider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </BrowserRouter>
  );
}

export default App;