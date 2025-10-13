import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true' || Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email alerts
export const sendEmailAlert = async (to, subject, alertType, weatherData, city, unsubscribeUrl) => {
  try {
    // Generate unsubscribe link (following Minh's approach)
    const unsubscribeLink = unsubscribeUrl || `${process.env.BASE_URL || 'http://localhost:3001'}/api/subscription/unsubscribe`;
    
    const htmlContent = `
      <h2>${alertType} Alert for ${city}</h2>
      <p>Weather Update:</p>
      <ul>
        <li><strong>Condition:</strong> ${weatherData.current?.description || 'N/A'}</li>
        <li><strong>Temperature:</strong> ${Math.round(weatherData.current?.temperature ?? 0)}°C</li>
        <li><strong>Location:</strong> ${city}</li>
      </ul>
      <p>Stay safe and take appropriate precautions!</p>
      <hr>
      <p><small><a href="${unsubscribeLink}">Unsubscribe from alerts</a></small></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default { sendEmailAlert };