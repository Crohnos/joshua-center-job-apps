const nodemailer = require('nodemailer');

// Load environment variables
const emailHost = process.env.EMAIL_HOST || 'smtp.example.com';
const emailPort = process.env.EMAIL_PORT || 587;
const emailUser = process.env.EMAIL_USER || 'user@example.com';
const emailPass = process.env.EMAIL_PASS || 'password';
const fromEmail = process.env.FROM_EMAIL || 'noreply@thejoshuacenter.com';

// Create reusable transporter
const createTransporter = () => {
  // Check if we have actual email credentials
  const hasCredentials = 
    emailHost !== 'smtp.example.com' && 
    emailUser !== 'user@example.com' && 
    emailPass !== 'password';

  // If we have real credentials, create a real transporter
  if (hasCredentials) {
    console.log('Using configured email transport');
    return nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  } 
  
  // Otherwise, use ethereal for testing (creates a temporary test email account)
  console.log('Using ethereal email transport for testing');
  return nodemailer.createTestAccount().then(account => {
    console.log('Created test email account:', account.user);
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  });
};

// Function to send verification code email
const sendVerificationEmail = async (to, code) => {
  try {
    // Create transporter
    const transporter = await createTransporter();
    
    // Define email content
    const mailOptions = {
      from: `"The Joshua Center" <${fromEmail}>`,
      to,
      subject: 'Your Verification Code for The Joshua Center Application',
      text: `
        Your verification code is: ${code}
        
        Please enter this code on the verification page to continue your application process.
        This code is valid for 15 minutes.
        
        If you did not request this code, please ignore this email.
        
        Thank you,
        The Joshua Center Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a6eb5; text-align: center;">The Joshua Center</h2>
          <h3 style="text-align: center; color: #333;">Your Verification Code</h3>
          
          <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #f5f5f5; border-radius: 4px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${code}
          </div>
          
          <p>Please enter this code on the verification page to continue your application process.</p>
          <p>This code is valid for 15 minutes.</p>
          
          <p style="color: #777; font-size: 0.9em; margin-top: 30px;">If you did not request this code, please ignore this email.</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777; font-size: 0.9em;">
            <p>The Joshua Center | Mental Health Services</p>
          </div>
        </div>
      `
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    // Log information about the sent email
    console.log('Email sent:', info.messageId);
    
    // If using ethereal, provide preview URL
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      return {
        success: true,
        previewUrl: nodemailer.getTestMessageUrl(info)
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

module.exports = {
  sendVerificationEmail
};