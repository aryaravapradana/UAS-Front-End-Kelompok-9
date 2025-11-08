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
    throw new Error('Could not send verification email.');
  }
};

const sendPasswordResetEmail = async (to, token) => {
  if (process.env.EMAIL_USER === 'user@example.com') {
    console.error('****************************************************************');
    console.error('*** ERROR: EMAIL SERVICE NOT CONFIGURED                      ***');
    console.error('*** Please update the EMAIL_* variables in backend/.env      ***');
    console.error('****************************************************************');
    return;
  }

  const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: `"UCCD FTI" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the button below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p>If you cannot click the button, please copy and paste the following link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in one hour.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr/>
        <p>UCCD FTI UNTAR</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', to);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Could not send password reset email.');
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };

