// ReCAPTCHA

function onSubmit(event) {
    event.preventDefault();
    var response = grecaptcha.getResponse();
    if(response.length == 0) {
      alert("Você precisa completar o reCAPTCHA.");
    } else {
      // Envie o token para o seu back-end
      var form = document.getElementById("myForm");
      var formData = new FormData(form);
      formData.append('g-recaptcha-response', response);
  
      // Use fetch ou XMLHttpRequest para enviar os dados para o back-end
      fetch('contact_form.php', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        // Processar a resposta do back-end
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }
