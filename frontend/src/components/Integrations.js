import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import { mockDataTeam } from "../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "./Header";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

const Integrations = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
 
  // Logout if Token is expired
  const [token] = useCookies(['workout-token']);
  useEffect(() => {
    if (!token['workout-token']) window.location.href = '/login';
  }, [token]);
  

  return (
        <Box m="20px">
          <Header title="Integrations" subtitle="Connect to Apple health, Renpho, Notion and custom data sources." />
          <Box>
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Coming soon
              </Typography>
            </Box>
          </Box>
        </Box>
      );
    };

    export default Integrations;
