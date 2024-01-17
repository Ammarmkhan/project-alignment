export const analyzeParagraph = async (input) => {

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