import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import { CookiesProvider } from 'react-cookie';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Team from './components/Team';
import Contacts from './components/Contacts';
import Invoices from './components/Invoices';
import Form from './components/Form';
import Bar from './components/Bar';
import Pie from './components/Pie';
import LineChart from './components/LineChart';
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
// import Calendar from './components/Calendar';
import FAQ from './components/FAQ';
import GeographyChart from './components/GeographyChart';
import { useLocation } from 'react-router-dom';




function MainContent({ isSidebar, setIsSidebar }) {
  // Get current location
  const location = useLocation();

  // Check if the current route is not login or signup
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
            <Route path="/team" element={<Team />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/form" element={<Form />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/line" element={<LineChart />} />
            <Route path="/faq" element={<FAQ />} />
            {/* <Route path="/calendar" element={<Calendar />} /> */}
            <Route path="/geography" element={<GeographyChart />} />
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