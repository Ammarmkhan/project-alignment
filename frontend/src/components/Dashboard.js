import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockTransactions } from "../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "./Header";
// import LineChart from "./LineChart";
// import GeographyChart from "./GeographyChart";
import BarChart from "./BarChart";
import StatBox from "./StatBox";
import ProgressCircle from "./ProgressCircle";
import AdsClickOutlinedIcon from '@mui/icons-material/AdsClickOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DynamicVisuals from "./DynamicVisuals";
import MainTextInput from "./MainTextInput";
import TextOutput from "./TextOutput";
import SecondaryTextInput from "./SecondaryTextInput";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from './toast';

const Dashboard = () => {

    // For theme setup
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Logout if Token is expired
    const [token] = useCookies(['workout-token']);
    useEffect(() => {
        if (!token['workout-token']) window.location.href = '/login';
    }, [token]);

    // For upload button
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

    // For csv upload
    const [file, setFile] = useState();

    const fileReader = new FileReader();
    
    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };


    const handleOnSubmit = (e) => {
      e.preventDefault();
  
      if (file) {
        fileReader.onload = function (event) {
          const csvOutput = event.target.result;
  
          // Send csv data to backend
          const handleCsvUpload = (csvData) => {
            fetch('http://localhost:8000/fitness_api/workouts/', {
              method: 'POST',
              headers: {
                'Content-Type': 'text/csv', // Set content type to text/csv
                'Authorization': `Token ${token['workout-token']}`
              },
              body: csvData, // Send raw CSV text
            })
              .then((resp) => resp.json())
              .catch((error) => console.log(error));
          };
  
          // Call handleCsvUpload with the CSV data
          handleCsvUpload(csvOutput);
        };
  
        fileReader.readAsText(file);
      }
    };
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                }}
            >
                Upload file
                <VisuallyHiddenInput type="file" id="csvFileInput" 
                    onChange={(e) => {
                        handleOnChange(e);
                        handleOnSubmit(e);
                        notify("Upload successful", "success");
                    }} />
            </Button>
            <ToastContainer />
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="127px"
        gap="15px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Visual Exploration
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <SaveOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0" p="30px">
            <DynamicVisuals/>
             {/* <LineChart isDashboard={true} /> */}
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Textual Exploration
            </Typography>
          </Box>
            <Box height="250px" m="-20px 0 0 0" p="30px">
                <TextOutput />
            </Box>
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 1"
          backgroundColor={colors.primary[400]}
        >
          <Box height="250px" m="-20px 0 0 0" p="30px">
             <MainTextInput />
          </Box>
         
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 1"
          backgroundColor={colors.primary[400]}
        >
        <Box height="250px" m="-20px 0 0 0" p="30px">
            <SecondaryTextInput />
        </Box>
          
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
