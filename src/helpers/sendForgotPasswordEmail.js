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

export async function sendForgotPasswordEmail(
  email,
  forgotPasswordCode,
  forgotPasswordUrl
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
      from: "EazyBuy <babonarnab@gmail.com>",
      to: email,
      subject: "EazyBuy | Forgot Password Code",
      text: `Please enter the following code to change your password:\n\n${forgotPasswordCode}\n\nOr copy and paste this url in your browser to reset email:${forgotPasswordUrl}\n\nThis code is valid only for 30 minutes.\n\nIf you did not request this code, please ignore this email.`,
      html: `
        <html>
          <body>
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <p>Please enter the following code to change your password:</p>
              <p style="font-size: 1.5em; font-weight: bold;">${forgotPasswordCode}</p>
              <p>Or copy and paste this url in your browser to reset password:</p>
              <p>${forgotPasswordUrl}</p>
              <p>This code is valid only for 30 minutes.</p>
              <p>If you did not request this code, please ignore this email.</p>
            </div>
          </body>
        </html>`,
    };

    await transport.sendMail(mailOptions);

    return {
      success: true,
      message: "forgot password email sent successfully",
    };
  } catch (error) {
    console.error("Error sending forgot password email:", error);

    return {
      success: false,
      message: "Failed to send forgot password email",
    };
  }
}
