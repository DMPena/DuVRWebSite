module.exports.handler = async (event, context) => {
  // Verify HTTP method
  if (event.httpMethod !== 'POST') {
      return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
      };
  }

  const secretKey = process.env.SITE_RECAPTCHA_SECRET;

  if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY is not set');
      return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Server configuration error' })
      };
  }

  let body;

  try {
      // Log the event.body to inspect its content
      console.log('event.body:', event.body);

      // Parse URL-encoded form data
      const formData = new URLSearchParams(event.body);
      body = Object.fromEntries(formData.entries());

      // Log the parsed body to inspect its content
      console.log('parsed body:', body);
  } catch (error) {
      console.error('Error parsing form data:', error);
      return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid form data' }),
      };
  }

  const token = body['g-recaptcha-response'];

  try {
      const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
      const response = await fetch(verificationUrl, { method: 'POST' });
      const verification = await response.json();

      if (!verification.success) {
          return {
              statusCode: 400,
              body: JSON.stringify({ error: 'reCAPTCHA verification failed' })
          };
      }

      // Form submission successful
      return {
          statusCode: 200,
          body: JSON.stringify({
              message: 'Form submitted successfully',
              data: { name: body.name, email: body.email }
          })
      };

  } catch (error) {
      console.error('Error during reCAPTCHA verification:', error);
      return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Server error during reCAPTCHA verification' })
      };
  }
};