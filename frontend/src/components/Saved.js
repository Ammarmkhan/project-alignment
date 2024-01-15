import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "./Header";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

const Saved = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Logout if Token is expired
  const [token] = useCookies(['workout-token']);
  useEffect(() => {
    if (!token['workout-token']) window.location.href = '/login';
  }, [token]);
  

  return (
    <Box m="20px">
      <Header title="Saved" subtitle="To view saved visuals for regular tracking." />
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

export default Saved;
