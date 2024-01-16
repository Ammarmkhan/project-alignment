import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import { CookiesProvider } from 'react-cookie';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Integrations from './components/Integrations';
import Saved from './components/Saved';
import Invoices from './components/Invoices';
import Form from './components/Form';
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
// import Calendar from './components/Calendar';
import FAQ from './components/FAQ';
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
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/form" element={<Form />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </CookiesProvider>
      </main>
    </div>
  );
}

function App() {
  // For theme and sidebar toggling
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <BrowserRouter>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MainContent isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </BrowserRouter>
  );
}

export default App;