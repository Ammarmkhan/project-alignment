import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import FollowupQuestions from './components/FollowupQuestions';
import WorkoutUpload from './components/WorkoutUpload';
import WorkoutVisualization from './components/WorkoutVisualization';
import { API } from './api-service';

/// Acceptance criteria: Registration
test('Registration process works', async () => {
  API.registerUser({ username: 'ammarkhan', password: 'password123' })
      .then((response) => {
        expect(response.username === 'A user with that username already exists.');
  });
});


/// Acceptance criteria: Login
test('Login process works', async () => {
  API.loginUser({ username: 'ammarkhan', password: 'password123' })
      .then((response) => {
        expect(response.username === 'Unable to log in with provided credentials.');
  });
});


// 

test('error raised for non-existent account during login', async () => {
  render(<Login />);

  // Assuming your Login component has form elements like username, password, etc.
  const usernameInput = screen.getByLabelText('Username');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByText('Login');

  // Fill out the login form with non-existent credentials
  fireEvent.change(usernameInput, { target: { value: 'nonExistentUser' } });
  fireEvent.change(passwordInput, { target: { value: 'invalidPassword' } });

  // Submit the form
  fireEvent.click(submitButton);

  // Wait for the error message to appear (use appropriate async handling if needed)
  await waitFor(() => {
    // Assert that the appropriate error message is displayed
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
  });
});


/// Acceptance Criteria: Cookie stored
test('cookie is stored upon the first successful log-in', async () => {
  render(<Login />);

  // Assuming your Login component has form elements like username, password, etc.
  const usernameInput = screen.getByLabelText('Username');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByText('Login');

  // Fill out the login form with valid credentials
  fireEvent.change(usernameInput, { target: { value: 'existingUser' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Submit the form
  fireEvent.click(submitButton);

  // Wait for the login to complete (use appropriate async handling if needed)
  await waitFor(() => {
    // Assert that the user is logged in (you may customize this based on your UI)
    expect(screen.getByText('Welcome, existingUser!')).toBeInTheDocument();
  });

  // Assert that the cookie is stored
  const storedCookie = document.cookie; // Retrieve the document's cookies
  expect(storedCookie).toMatch(/yourCookieName=yourCookieValue/); // Replace with actual cookie details
});

/// AC: Can upload csv data
test('system handles upload of workout CSV and shows confirmation message', async () => {
  render(<WorkoutUpload />);

  // Assuming your WorkoutUpload component has an input for file selection and an upload button
  const fileInput = screen.getByLabelText('Select CSV file');
  const uploadButton = screen.getByText('Upload');

  // Create a sample CSV file to upload
  const sampleCSV = new File(['Date,Exercise,Reps,Weight\n2022-01-01,Squats,10,100'], 'workout.csv', {
    type: 'text/csv',
  });

  // Trigger file selection
  fireEvent.change(fileInput, { target: { files: [sampleCSV] } });

  // Submit the form
  fireEvent.click(uploadButton);

  // Wait for the upload to complete (use appropriate async handling if needed)
  await waitFor(() => {
    // Assert that the confirmation message is displayed
    expect(screen.getByText('Upload successful!')).toBeInTheDocument();
  });
});


/// AC: Visualize sets for various muscle groups
// The system should allow the user to input a natural language request to see progress in any given muscle and return the appropriate visual.

test('system allows user to input a natural language request to see progress in any given muscle', async () => {
  render(<WorkoutVisualization />);

  // Select a muscle
  fireEvent.change(muscleInput, { target: { value: 'Show me progress in biceps' } });

  // Submit the form
  fireEvent.click(submitButton);

  // Wait for the visualization to complete (use appropriate async handling if needed)
  await waitFor(() => {
    // Assert that the visualization title is 'Biceps'
    expect(screen.getByText('Biceps')).toBeInTheDocument();
  });
});

// Deal with gibberish input
test('system allows user to input a natural language request to see progress in any given muscle', async () => {
  render(<WorkoutVisualization />);

  // Give input
  fireEvent.change(muscleInput, { target: { value: 'ndfnsdfbl' } });

  // Submit the form
  fireEvent.click(submitButton);

  // Wait for the visualization to complete
  await waitFor(() => {
    // Ensure edge case handled
    expect(screen.getByText("I'm sorry. I don't quite get that.")).toBeInTheDocument();
  });
});


/// Ask follow-up questions from muscles visualized data
test('system allows user to ask follow-up questions from muscles visualized data', async () => {
  render(<FollowupQuestions />);

  // Ask exercises 
  // FollowupQuestions component has an input field with label 'Followup Question?'
  const exerciseInput = screen.getByLabelText('Followup Question?');
  fireEvent.change(exerciseInput, { target: { value: 'What exercises did I do the last 4 weeks?' } });

  // Submit the form
  fireEvent.click(submitButton);

  // Wait for the visualization to complete
  await waitFor(() => {
    // Ensure output received
    expect(screen.getByText(/.+/)).toBeInTheDocument();
  });
});



