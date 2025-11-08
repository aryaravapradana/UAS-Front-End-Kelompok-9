const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // show debug output
  logger: true, // log information in console
});

const sendVerificationEmail = async (to, token) => {
  // Check if the email service is configured.
  if (process.env.EMAIL_USER === 'user@example.com') {
    console.error('****************************************************************');
    console.error('*** ERROR: EMAIL SERVICE NOT CONFIGURED                      ***');
    console.error('*** Please update the EMAIL_* variables in backend/.env      ***');
    console.error('****************************************************************');
    // We don't throw an error here, so the API request doesn't fail,
    // but the email will not be sent. The user sees a success message,
    // but the developer sees this clear error in the logs.
    return;
  }

  const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: `"UCCD FTI" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Verify Your Email Address for UCCD',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Please Verify Your Email Address</h2>
        <p>Thank you for registering with UCCD. Please click the button below to verify your email address.</p>
        <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        <p>If you cannot click the button, please copy and paste the following link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <hr/>
        <p>UCCD FTI UNTAR</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', to);
  } catch (error) {
    console.error('Error sending verification email:', error);
    // In a real app, you might want to handle this more gracefully
    throw new Error('Could not send verification email.');
  }
};

module.exports = { sendVerificationEmail };
