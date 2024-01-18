import { Avatar, Box, Typography, useTheme } from "@mui/material";
import React, { useState } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import { processData } from "./processData";
import { red } from "@mui/material/colors";
import { analyzeParagraph } from "./analyzeParagraph";
import { WorkoutContext } from '../App'; // import the context
import { MainContainer, ChatContainer, MessageInput } from '@chatscope/chat-ui-kit-react';
import './chat.css'

// to link to dashboard.js
const DynamicVisuals = (props) => {

    // Fetch token from cookies
    const [token] = useCookies(['workout-token']);
    
    // Code to create chart based on user input
    const [chartInstance, setChartInstance] = useState(null);

    const createOrUpdateChart = (data_set, chartTitle) => {
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
                responsive: false, // Add this line to prevent the chart from being responsive
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Muscle: ${chartTitle}`
                    },
                },
            },
        };

        if (chartInstance) {
            chartInstance.data.labels = data_set.labels;
            chartInstance.data.datasets[0].data = data_set.data;
            chartInstance.options.plugins.title.text = `Muscle: ${chartTitle}`; 
            chartInstance.update();
        } else {
            const newChartInstance = new Chart(document.getElementById('myChart'), config);
            setChartInstance(newChartInstance);
        }
    };

    // Create chart when form submission triggered
    const { selectedWorkout, setSelectedWorkout } = React.useContext(WorkoutContext);


    
    const handleInputChange = (event) => {
            setSelectedWorkout(event);
        }

    const handleFormSubmit = async (event) => {
        // event.preventDefault();
        
        try {
            const analyzedData = await analyzeParagraph(selectedWorkout);
            const data_set = processData(props.workouts, analyzedData); // Do relevant processing
            createOrUpdateChart(data_set, analyzedData);
        } catch (error) {
            console.error('Error:', error);
        }
    };



    // For follow-up Questions
    const [subQuestion, setSubQuestion] = useState('');

    async function analyzeFollowup (json_object, sub_question) {
        const sub_q = sub_question;
        const json_o = json_object;

        try {
            // Make an AJAX request to the Django backend
            const response = await fetch('http://localhost:8000/fitness_api/followup-question/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(({ sub_q, json_o })),
            });

            const data = await response.json();

            // Select the DOM element where you want to display the data
            const outputElement = document.getElementById('followupResponse');

            // Update the content of the selected DOM element
            outputElement.innerHTML = data.responseR.replace(/\n/g, '<br>');

        } catch (error) {
            console.error('Error:', error);
            throw error; // Rethrow the error to be caught by the caller
        }
    };

    // To keep track of the follow-up question asked
    const handleSubQuestion = (event) => {
        setSubQuestion(event.target.value);
    }

    // To submit follow-up question form.
    const handleFollowupFormSubmit = async (event) => {
        event.preventDefault();
        
        try {
            // to send back json
            const analyzedData = await analyzeParagraph(selectedWorkout);
            const data_set = processData(props.workouts, analyzedData);

            await analyzeFollowup(data_set, subQuestion);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div>
                <canvas id="myChart" width="500" height="390"></canvas>
            </div>
            <div className='chatPage-div'>
                <MainContainer>
                    <ChatContainer>
                        <MessageInput placeholder={selectedWorkout} onChange={handleInputChange} onSend={handleFormSubmit} attachButton={false}/>
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
};

export default DynamicVisuals;