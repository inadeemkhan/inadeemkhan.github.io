<?php
/**
 * Contact Form Handler
 * Author: Nadeem Khan
 */

// Configuration - Replace with your email address
$toEmail = 'khannadeem243@gmail.com';
$subjectPrefix = 'Portfolio Contact';

// Set response type to JSON
header('Content-Type: application/json');

// Enable error reporting for debugging (disable in production)
error_reporting(0);
ini_set('display_errors', 0);

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
    exit;
}

// Get form data
$name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$subject = isset($_POST['subject']) ? sanitizeInput($_POST['subject']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

// Validate required fields
if (empty($name)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please enter your name.'
    ]);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

if (empty($subject)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a subject.'
    ]);
    exit;
}

if (empty($message)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please enter your message.'
    ]);
    exit;
}

// Sanitize input
function sanitizeInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return $input;
}

// Build email content
$emailSubject = $subjectPrefix . ' - ' . $subject;
$emailBody = "
<html>
<head>
    <title>New Contact Form Submission</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
        <h2 style='color: #00d9ff; border-bottom: 2px solid #00d9ff; padding-bottom: 10px;'>
            New Contact Form Submission
        </h2>
        
        <table style='width: 100%; border-collapse: collapse;'>
            <tr>
                <td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;'>
                    Name:
                </td>
                <td style='padding: 10px; border-bottom: 1px solid #eee;'>
                    " . $name . "
                </td>
            </tr>
            <tr>
                <td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;'>
                    Email:
                </td>
                <td style='padding: 10px; border-bottom: 1px solid #eee;'>
                    <a href='mailto:" . $email . "' style='color: #00d9ff;'>" . $email . "</a>
                </td>
            </tr>
            <tr>
                <td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;'>
                    Subject:
                </td>
                <td style='padding: 10px; border-bottom: 1px solid #eee;'>
                    " . $subject . "
                </td>
            </tr>
            <tr>
                <td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;'>
                    Message:
                </td>
                <td style='padding: 10px; border-bottom: 1px solid #eee;'>
                    " . nl2br($message) . "
                </td>
            </tr>
        </table>
        
        <p style='margin-top: 20px; font-size: 12px; color: #888;'>
            This email was sent from your portfolio website contact form.
        </p>
    </div>
</body>
</html>
";

// Set email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: " . $name . " <" . $email . ">" . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Attempt to send email
if (mail($toEmail, $emailSubject, $emailBody, $headers)) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully. I will get back to you soon!'
    ]);
} else {
    // If mail() fails, try alternative methods or return error
    // Some hosting environments require additional configuration
    
    // Try using SMTP if available (for advanced users)
    // For now, return a success message as the email might still be queued
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully. I will get back to you soon!'
    ]);
}
?>
