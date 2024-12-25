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
      // Verify reCAPTCHA response
      if (isset($_POST['g-recaptcha-response']) && !empty($_POST['g-recaptcha-response'])) {
        $secret = $_ENV['RECAPTCHA_SECRET_KEY'];
        $response = $_POST['g-recaptcha-response'];

    // Verify the token with Google reCAPTCHA
    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = array(
        'secret' => $secret,
        'response' => $response
    );

    // Use cURL to send the request
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
    if ($verifyResponse->success) {
        // Send email
        $to = "dmpena22@gmail.com";
        $subject = "Message from Your Website";
        $emailMessage = "Name: $name\nEmail: $email\nMessage: $message";
        $headers = "From: $email";

        if (mail($to, $subject, $emailMessage, $headers)) {
            echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Message could not be sent. Please try again later.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'reCAPTCHA verification failed. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA response not set. Please try again.']);
}
} else {
echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>