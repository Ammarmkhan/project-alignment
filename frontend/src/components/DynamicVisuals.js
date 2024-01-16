import { Box, Typography, useTheme } from "@mui/material";
import React, { useState } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import { processData } from "./processData";
import { red } from "@mui/material/colors";


// to link to dashboard.js
const DynamicVisuals = (props) => {

    // Fetch token from cookies
    const [token] = useCookies(['workout-token']);

    // Take user input for visual exploration
    async function analyzeParagraph(input) {
        const paragraph = input;

        try {
            // Make an AJAX request to the Django backend
            const response = await fetch('http://localhost:8000/fitness_api/analyze-paragraph/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paragraph }),
            });

            const data = await response.json();
            return data.word;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Rethrow the error to be caught by the caller
        }
    };

    
    // Code to create chart based on user input
    const [chartInstance, setChartInstance] = useState(null);

    const createOrUpdateChart = (data_set) => {
        const data = {
                labels: data_set.labels,
                datasets: [
                    {
                        label: 'Workout Counts',
                        data: data_set.data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        type: 'bar',
                        meta: data_set.exerciseData,
                    },
                    {
                        label: 'For majority gains',
                        data: Array(data_set.labels.length).fill(10),
                        borderColor:  'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        type: 'line',
                    },
                ],
            };

        const config = {
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                }
            },
        };

        if (chartInstance) {
            chartInstance.data.labels = data_set.labels;
            chartInstance.data.datasets[0].data = data_set.data;
            chartInstance.update();
        } else {
            const newChartInstance = new Chart(document.getElementById('myChart'), config);
            setChartInstance(newChartInstance);
        }
    };

    // Create chart when form submission triggered
    const [selectedWorkout, setSelectedWorkout] = useState('...');
    const handleInputChange = (event) => {
            setSelectedWorkout(event.target.value);
        }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const analyzedData = await analyzeParagraph(selectedWorkout);
            const data_set = processData(props.workouts, analyzedData); // Do relevant processing
            console.log(data_set);
            createOrUpdateChart(data_set);
        } catch (error) {
            console.error('Error:', error);
        }
    };



    // 

    // // For openAI interpretation 
    // async function analyzeParagraph(input) {
    //     const paragraph = input;

    //     try {
    //         // Make an AJAX request to the Django backend
    //         const response = await fetch('http://localhost:8000/fitness_api/analyze-paragraph/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ paragraph }),
    //         });

    //         const data = await response.json();
    //         return data.word;
    //     } catch (error) {
    //         console.error('Error:', error);
    //         throw error; // Rethrow the error to be caught by the caller
    //     }
    // };


    return (
                <div>
                    <canvas id="myChart"></canvas>
                    <form onSubmit={handleFormSubmit}> 
                        <label>
                            What kind of visualization would you like to see?
                            <input type="text" value={selectedWorkout} onChange={handleInputChange} />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            );
        };

export default DynamicVisuals;