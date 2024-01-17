import React, { useState } from 'react';
import { useEffect } from 'react';
import { processData } from "./processData";
import { analyzeParagraph } from "./analyzeParagraph";
import { WorkoutContext } from '../App'; 
import { MainContainer, ChatContainer, MessageInput, MessageList, Message } from '@chatscope/chat-ui-kit-react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Avatar } from '@mui/material';



const TextOutput = (props) => {
    // Main question input
    const { selectedWorkout, setSelectedWorkout } = React.useContext(WorkoutContext);

    // For follow-up Questions
    const [subQuestion, setSubQuestion] = useState('');
    const [followupResponse, setFollowupResponse] = useState('');

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
            setFollowupResponse(data.responseR.replace(/\n/g, '<br>'));
            // const outputElement = document.getElementById('followupResponse');

            // // Update the content of the selected DOM element
            // outputElement.innerHTML = data.responseR.replace(/\n/g, '<br>');

        } catch (error) {
            console.error('Error:', error);
            throw error; // Rethrow the error to be caught by the caller
        }
    };

    // To keep track of the follow-up question asked
    const handleSubQuestion = (event) => {
        setSubQuestion(event);
    }

    // To submit follow-up question form.
    const handleFollowupFormSubmit = async (event) => {
        // event.preventDefault();
        
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
            <p id="followupResponse"></p>
            <MessageList>
                <Message model={{
                    message: followupResponse,
                    direction: 'incoming',
                }} />
            </MessageList>
            {/* <form onSubmit={handleFollowupFormSubmit}> 
                <label>
                    What would you like to ask of the visualization?
                    <input type="text" value={subQuestion} onChange={handleSubQuestion} />
                </label>
                <button type="submit">Submit</button>
            </form> */}
            <div>
                <MainContainer>
                    <ChatContainer>
                        <MessageInput placeholder={subQuestion} onChange={handleSubQuestion} onSend={handleFollowupFormSubmit}/>
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
};

export default TextOutput;


