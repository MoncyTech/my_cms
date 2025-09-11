// src/api/email/services/brevo.js
const axios = require("axios");

module.exports = {
  async sendEmail({ to, subject, html, text, from, fromName }) {
    try {
      console.log(`📧 Sending email to: ${to}`);

      const emailData = {
        sender: {
          name: fromName || process.env.RESTAURANT_NAME || "Restaurant",
          email: from || process.env.RESTAURANT_EMAIL,
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
        textContent: text,
      };
      const headers = {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        emailData,
        {
          headers,
          timeout: 30000, // 30 seconds
        }
      );

      console.log("✅ Email sent successfully!");
      console.log("Message ID:", response.data.messageId);

      return {
        success: true,
        messageId: response.data.messageId,
      };
    } catch (error) {
      console.error("❌ Email sending failed:");
      console.error("Status:", error.response?.status);
      console.error("Error:", error.response?.data || error.message);

      throw new Error(
        error.response?.data?.message || error.message || "Failed to send email"
      );
    }
  },
};
