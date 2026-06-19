import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

if (process.env.GMAIL_USER_EMAIL && process.env.GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export const sendDailyStudyPlanEmail = async (userEmail, userName, planHtml) => {
  if (!transporter) {
    console.error('⚠️  Email not sent: Email credentials are not configured in environment variables.');
    return;
  }

  try {
    const mailOptions = {
      from: `"Semester Mentor AI" <${process.env.GMAIL_USER_EMAIL}>`,
      to: userEmail,
      subject: `📚 Your Daily Study Plan - Semester Mentor AI`,
      html: `
        <h2>Good morning, ${userName}!</h2>
        <p>Here is your study plan for today:</p>
        <div>
          ${planHtml}
        </div>
        <p>Log in to the app to mark these tasks as completed!</p>
        <p>Best regards,<br/>Semester Mentor AI</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email to ${userEmail}:`, error);
  }
};
