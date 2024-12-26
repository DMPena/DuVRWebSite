exports.handler = async (event, context) => {
    const fetch = (await import('node-fetch')).default;

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
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
            throw new Error('Invalid JSON input');
        }
    } catch (error) {
        console.error('JSON parsing error:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON' }),
        };
    }

    const token = body['g-recaptcha-response'];

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const response = await fetch(verificationUrl, { method: 'POST' });
    const verification = await response.json();

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
};
