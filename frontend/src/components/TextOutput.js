import React, { useState } from 'react';
import { useEffect } from 'react';
import { processData } from "./processData";
import { analyzeParagraph } from "./analyzeParagraph";
import { WorkoutContext } from '../App'; 
import { MainContainer, ChatContainer, MessageInput, MessageList, Message, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Avatar } from '@mui/material';
import './chat.css'



const TextOutput = (props) => {
    // Main question input
    const { selectedWorkout, setSelectedWorkout } = React.useContext(WorkoutContext);

    // For follow-up Questions
    const [subQuestion, setSubQuestion] = useState('');
    const [followupResponse, setFollowupResponse] = useState('');

    // To show August is processing
    const [isProcessing, setIsProcessing] = useState(false);

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

            // Processing is done, so set isProcessing to false
            setIsProcessing(false);

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
        
        // Processing starts here, so set isProcessing to true
        setIsProcessing(true);
        
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
        <div className='followup-Chat'>
            <MessageList typingIndicator={isProcessing ? <TypingIndicator content="August is processing" /> : null}>
                <Message model={{
                    message: followupResponse,
                    direction: 'incoming',
                }} />
            </MessageList>
            <div>
                <MainContainer>
                    <ChatContainer>
                        <MessageInput placeholder={subQuestion} onChange={handleSubQuestion} onSend={handleFollowupFormSubmit} attachButton={false}/>
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
};

export default TextOutput;


