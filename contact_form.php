<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = htmlspecialchars($_POST['name']);
  $email = htmlspecialchars($_POST['email']);
  $message = htmlspecialchars($_POST['message']);
  $recaptchaResponse = $_POST['g-recaptcha-response'];
  
  // Validate email
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "<p>Invalid email address. Please try again.</p>";
  } else {
    // Verifique se o token foi enviado
    if (isset($_POST['g-recaptcha-response'])) {
      $secret = 'SITE_RECAPTCHA_SECRET'; // Substitua pela sua chave secreta do reCAPTCHA
      $response = $_POST['g-recaptcha-response'];

      // Verifique o token com o Google reCAPTCHA
      $url = 'https://www.google.com/recaptcha/api/siteverify';
      $data = array(
          'secret' => $secret,
          'response' => $response
      );

      // Use cURL para enviar a requisição
      $options = array(
          'http' => array(
              'header'  => "Content-type: application/x-www-form-urlencoded",
              'method'  => 'POST',
              'content' => http_build_query($data)
          )
      );
      $context  = stream_context_create($options);
      $result = file_get_contents($url, false, $context);
      $verifyResponse = json_decode($result);

      // Verifique se o token é válido
      if ($verifyResponse->success) {
        // O token é válido, processe o formulário
        // Send email
        $to = "dmpena22@gmail.com";
        $subject = "Message from Your Website";
        $message = "Name: $name\nEmail: $email\nMessage: $message";
        $headers = "From: $email";

        if (mail($to, $subject, $message, $headers)) {
            echo "<script>showMessage('Message sent successfully!', false);</script>";
        } else {
            echo "<script>showMessage('Message could not be sent. Please try again later.', true);</script>";
        }
      } else {
        // O token é inválido, exiba uma mensagem de erro
        echo "Você não é um robô!";
      }
    } else {
      // O token não foi enviado
      echo "Erro: Token não encontrado.";
    }
  }
}
?>
