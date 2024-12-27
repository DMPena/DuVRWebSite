// Attach event listener to the form
document.getElementById('myForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    
    // Get the form element
    const form = event.target;
  
    // Validate the form
    if (!form.checkValidity()) {
      alert('Please fill out all required fields.');
      return;
    }
  
    // Create a FormData object from the form
    const formData = new FormData(form);
  
    // Convert FormData to a JSON object
    const jsonObject = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
  
    try {
      // Send the JSON data to the Netlify function
      const response = await fetch('/.netlify/functions/validate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonObject), // Convert JSON object to string
      });
  
      // Parse the JSON response from the server
      const data = await response.json();
  
      // Log the server response or handle it as needed
      if (response.ok) {
        console.log('Server Response:', data);
        alert('Form submitted successfully!');
        form.reset(); // Clear the form
      } else {
        console.error(`Server Error ${response.status}:`, data);
        alert(`Error: ${data.error || 'Unexpected error occurred.'}`);
      }
    } catch (error) {
      // Handle any network or unexpected errors
      console.error('Network Error:', error);
      alert('An error occurred. Please try again.');
    }
  });
  