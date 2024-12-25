exports.handler = async (event, context) => {
    const fetch = (await import('node-fetch')).default;

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    let body;

    // Check if event.body is a string and parse it if necessary
    if (typeof event.body === 'string') {
        body = JSON.parse(event.body);
    } else {
        body = event.body;
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
