import nodemailer from "nodemailer";
import { google } from "googleapis";

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.REDIRECT_URI;
const refreshToken = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectURI
);

oauth2Client.setCredentials({
  refresh_token: refreshToken,
});

export async function sendVerificationEmail(
  email,
  username,
  verifyCode,
  verifyUrl
) {
  try {
    const { token: accessToken } = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "Gmail",
      secure: true,
      port: 465,
      auth: {
        type: "OAuth2",
        user: "babonarnab@gmail.com",
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });

    const mailOptions = {
      from: "VibeBox <babonarnab@gmail.com>",
      to: email,
      subject: "VibeBox | Verification Code",
      text: `Hello, ${username}\n\nThank you for registering. Please use the following verification code to complete your registration:\n\n${verifyCode}\n\nThis code is valid only for 1 hour.\n\nIf you did not request this code, please ignore this email.`,
      html: `
        <html>
          <body>
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Hello ${username},</h2>
              <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
              <p style="font-size: 1.5em; font-weight: bold;">${verifyCode}</p>
              <p>Or copy and paste this url in your browser to verify your account:</p>
              <p>${verifyUrl}</p>
              <p>This code is valid only for 1 hour.</p>
              <p>If you did not request this code, please ignore this email.</p>
            </div>
          </body>
        </html>`,
    };

    await transport.sendMail(mailOptions);

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
