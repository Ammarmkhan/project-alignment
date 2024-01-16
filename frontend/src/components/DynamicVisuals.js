import { Box, Typography, useTheme } from "@mui/material";
import React, { useState } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import { processData } from "./processData";


// to link to dashboard.js
const DynamicVisuals = (props) => {
    

    // Console.log to check props
    const handleClick = async () => {
        const test = await analyzeParagraph('fsdf chest');
        console.log(test);
        console.log(props);
    };


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

    // For form submit
    const [selectedWorkout, setSelectedWorkout] = useState('default');
    const handleInputChange = (event) => {
            setSelectedWorkout(event.target.value);
        }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const analyzedData = await analyzeParagraph(selectedWorkout);
            const data_set = processData(props.workouts, analyzedData); // Do relevant processing
            console.log(data_set);
            
            // createOrUpdateChart(data_set);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Process the data


    // // For visualizing data
    // const [chartInstance, setChartInstance] = useState(null);
    // const [selectedWorkout, setSelectedWorkout] = useState('default');

    // const createOrUpdateChart = (data_set) => {
    //     const data = {
    //         labels: data_set.labels,
    //         datasets: [
    //             {
    //                 label: 'Workout Counts',
    //                 data: data_set.data,
    //                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //                 borderColor: 'rgba(75, 192, 192, 1)',
    //                 borderWidth: 1,
    //                 type: 'bar',
    //                 meta: data_set.exerciseData,
    //             },
    //             {
    //                 label: 'For 85% gains',
    //                 data: Array(data_set.labels.length).fill(10),
    //                 borderColor: data_set.line_color,
    //                 borderWidth: 1,
    //                 type: 'line',
    //             },
    //         ],
    //     };

    //     const config = {
    //         data: data,
    //         options: {
    //             scales: {
    //                 y: {
    //                     beginAtZero: true,
    //                 },
    //             }
    //         },
    //     };

    //     if (chartInstance) {
    //         chartInstance.data.labels = data_set.labels;
    //         chartInstance.data.datasets[0].data = data_set.data;
    //         chartInstance.data.datasets[1].borderColor = data_set.line_color; // Update line color
    //         chartInstance.update();
    //     } else {
    //         const newChartInstance = new Chart(document.getElementById('myChart'), config);
    //         setChartInstance(newChartInstance);
    //     }
    // };

   

    // // For input change
    // const handleInputChange = (event) => {
    //     setSelectedWorkout(event.target.value);
    // }


    // // Fetch token from cookies
    // const [token] = useCookies(['workout-token']);

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
                    <h1 onClick={handleClick}>Dynamic Visuals</h1>
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

/// After
{/* <div>
<form onSubmit={handleFormSubmit}> 
    <label>
        What kind of visualization would you like to see?
        <input type="text" value={selectedWorkout} onChange={handleInputChange} />
    </label>
    <button type="submit">Submit</button>
</form>
</div>
{/* Render the chart canvas */}
{/* <canvas id="myChart"></canvas> */} 

////


// // See below for inspiration
// import { ResponsiveLine } from "@nivo/line";
// import { useTheme } from "@mui/material";
// import { tokens } from "../theme";
// import { mockLineData as data } from "../data/mockData";

// const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   return (
//     <ResponsiveLine
//       data={data}
//       theme={{
//         axis: {
//           domain: {
//             line: {
//               stroke: colors.grey[100],
//             },
//           },
//           legend: {
//             text: {
//               fill: colors.grey[100],
//             },
//           },
//           ticks: {
//             line: {
//               stroke: colors.grey[100],
//               strokeWidth: 1,
//             },
//             text: {
//               fill: colors.grey[100],
//             },
//           },
//         },
//         legends: {
//           text: {
//             fill: colors.grey[100],
//           },
//         },
//         tooltip: {
//           container: {
//             color: colors.primary[500],
//           },
//         },
//       }}
//       colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
//       margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
//       xScale={{ type: "point" }}
//       yScale={{
//         type: "linear",
//         min: "auto",
//         max: "auto",
//         stacked: true,
//         reverse: false,
//       }}
//       yFormat=" >-.2f"
//       curve="catmullRom"
//       axisTop={null}
//       axisRight={null}
//       axisBottom={{
//         orient: "bottom",
//         tickSize: 0,
//         tickPadding: 5,
//         tickRotation: 0,
//         legend: isDashboard ? undefined : "transportation", // added
//         legendOffset: 36,
//         legendPosition: "middle",
//       }}
//       axisLeft={{
//         orient: "left",
//         tickValues: 5, // added
//         tickSize: 3,
//         tickPadding: 5,
//         tickRotation: 0,
//         legend: isDashboard ? undefined : "count", // added
//         legendOffset: -40,
//         legendPosition: "middle",
//       }}
//       enableGridX={false}
//       enableGridY={false}
//       pointSize={8}
//       pointColor={{ theme: "background" }}
//       pointBorderWidth={2}
//       pointBorderColor={{ from: "serieColor" }}
//       pointLabelYOffset={-12}
//       useMesh={true}
//       legends={[
//         {
//           anchor: "bottom-right",
//           direction: "column",
//           justify: false,
//           translateX: 100,
//           translateY: 0,
//           itemsSpacing: 0,
//           itemDirection: "left-to-right",
//           itemWidth: 80,
//           itemHeight: 20,
//           itemOpacity: 0.75,
//           symbolSize: 12,
//           symbolShape: "circle",
//           symbolBorderColor: "rgba(0, 0, 0, .5)",
//           effects: [
//             {
//               on: "hover",
//               style: {
//                 itemBackground: "rgba(0, 0, 0, .03)",
//                 itemOpacity: 1,
//               },
//             },
//           ],
//         },
//       ]}
//     />
//   );
// };

// export default LineChart;



