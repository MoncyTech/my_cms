"use strict";

const nodemailer = require("nodemailer");

module.exports = ({ strapi }) => ({
  async sendBookingNotification(bookingData) {
    const { name, phone, email, date, startTime, endTime, specialRequests } =
      bookingData;

    const transporter = nodemailer.createTransport({
      host: strapi.config.get("plugin.email.config.providerOptions.host"),
      port: strapi.config.get("plugin.email.config.providerOptions.port"),
      secure: strapi.config.get(
        "plugin.email.config.providerOptions.secure",
        false
      ),
      auth: {
        user: strapi.config.get(
          "plugin.email.config.providerOptions.auth.user"
        ),
        pass: strapi.config.get(
          "plugin.email.config.providerOptions.auth.pass"
        ),
      },
    });

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const mailOptions = {
      from: strapi.config.get("plugin.email.settings.defaultFrom"),
      to: strapi.config.get("plugin.email.settings.defaultReplyTo"),
      cc: process.env.OWNER_EMAIL,
      subject: `New Booking: ${name} - ${formattedDate}`,
      text: `
New Booking Details:
-------------------
Name: ${name}
Phone: ${phone}
Email: ${email}
Date: ${formattedDate}
Time: ${startTime} - ${endTime}

Tables Booked:
${bookingData.tables.map((t) => `${t.count} × ${t.name} (${t.totalGuests} people)`).join("\n")}

Total Guests: ${bookingData.totalGuests}

Special Requests: ${specialRequests || "None"}
      `,
      html: `
<h1>New Booking Received</h1>
<h2>${name} - ${formattedDate}</h2>

<table style="width: 100%; border-collapse: collapse;">
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Contact</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">
      ${name}<br>
      Phone: ${phone}<br>
      Email: ${email}
    </td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Date & Time</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">
      ${formattedDate}<br>
      ${startTime} - ${endTime}
    </td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Tables</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">
      <ul style="margin: 0; padding-left: 20px;">
        ${bookingData.tables
          .map(
            (t) => `<li>${t.count} × ${t.name} (${t.totalGuests} people)</li>`
          )
          .join("")}
      </ul>
      <p><strong>Total Guests:</strong> ${bookingData.totalGuests}</p>
    </td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Special Requests</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">
      ${specialRequests || "None"}
    </td>
  </tr>
</table>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      strapi.log.error("Error sending booking email:", error);
      return false;
    }
  },
});
