const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const { 'g-recaptcha-response': token } = JSON.parse(event.body);

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
