<?php
require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = htmlspecialchars($_POST['name']);
  $email = htmlspecialchars($_POST['email']);
  $message = htmlspecialchars($_POST['message']);
  $recaptchaResponse = $_POST['g-recaptcha-response'];
  
  // Validate email
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address. Please try again.']);
  } else {
    // Verifique se o token foi enviado
    if (isset($_POST['g-recaptcha-response'])) {
      $secret = getenv('RECAPTCHA_SECRET_KEY'); // Substitua pela sua chave secreta do reCAPTCHA
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
          echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
        } else {
          echo json_encode(['success' => false, 'message' => 'Message could not be sent. Please try again later.']);
        }
      } else {
        echo json_encode(['success' => false, 'message' => 'reCAPTCHA verification failed. Please try again.']);
      }
    } else {
      echo json_encode(['success' => false, 'message' => 'reCAPTCHA response not found.']);
    }
  }
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
