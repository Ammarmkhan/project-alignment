import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "./Header";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DynamicVisuals from "./DynamicVisuals";
import TextOutput from "./TextOutput";
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

    const [workouts, setWorkouts] = useState([]);
    
    // For csv upload
    const [file, setFile] = useState();

    const fileReader = new FileReader();
    
    const handleFileSelection = (e) => {
        const file = e.target.files[0];
        setFile(file);
    
        if (file) {
            const fileReader = new FileReader();
            notify("Upload successful", "success");
    
            fileReader.onload = function (event) {
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
                    .then(() => {
                        // Delay the GET request by 2 seconds
                        setTimeout(() => {
                            fetch('http://localhost:8000/fitness_api/workouts/', {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Token ${token['workout-token']}`
                                },
                            })
                            .then(resp => resp.json())
                            .then(resp => {
                                setWorkouts(resp);
                            })
                            .catch(error => {
                                console.log(error);
                                notify('upload not successful', 'error');
                            });
                        }, 2000); // 2000 milliseconds = 2 seconds
                    })
                    .catch((error) => {
                        console.log(error);
                        notify('upload not successful', 'error');
                    });
                };
    
                // Call handleCsvUpload with the CSV data
                handleCsvUpload(event.target.result);
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
                            handleFileSelection(e);
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
            gridRow="span 4"
            backgroundColor='white'
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
                <DynamicVisuals workouts={workouts}/>
            </Box>
            </Box>
            <Box
            gridColumn="span 4"
            gridRow="span 4"
            backgroundColor='white'
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
                    <TextOutput workouts={workouts}/>
                </Box>
            </Box>

      
        </Box>
        </Box>
    );
    };

export default Dashboard;
