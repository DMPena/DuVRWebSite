import fetch from 'node-fetch';

/**
 * Handles the form validation and reCAPTCHA verification.
 * 
 * @param {Object} event - The event object containing the request data.
 * @returns {Object} - The response object with status code and message.
 */
export const handler = async (event) => {

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
        console.error('RECAPTCHA_SECRET_KEY is not set');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error' }),
        };
    }
    let body;

    try {
        // Log the event.body to inspect its content
        console.log('event.body:', event.body);

        // Check if event.body is a string and parse it if necessary
        if (typeof event.body === 'string' && event.body.trim() !== '') {
            body = JSON.parse(event.body);
        } else if (typeof event.body === 'object') {
            body = event.body;
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid JSON input' }),
            };
        }
        if (!body.token) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'reCAPTCHA token is missing' }),
            };
        }

        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${body.token}`;

        let verification;
        try {
            const response = await fetch(verificationUrl, { method: 'POST' });
            verification = await response.json();
        } catch (error) {
            console.error('Network error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Network error' }),
            };
        }

        if (!verification.success) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'reCAPTCHA verification failed' }),
            };
        }

        // Process form data if reCAPTCHA is successful
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Form submitted successfully' }),
        };
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON input' }),
        };
    }
};
