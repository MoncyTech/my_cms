/**
 * booking controller
 */

import { factories } from "@strapi/strapi";
function generateBookingId() {
  const timestamp = Date.now().toString(36).toUpperCase(); // ~6–7 chars
  const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 chars
  return `BK${(timestamp + randomPart).substring(0, 10)}`;
}

export function bookingRequestConsumerTemplate({
  bookingId,
  customerName,
  restaurantName,
  bookingDate,
  bookingTime,
  guests,
  table_selections,
}: {
  bookingId: string | number;
  customerName: string;
  restaurantName: string;
  bookingDate: string;
  bookingTime: string;
  guests: number;
  table_selections?: any[];
}) {
  return {
    subject: `Booking Request (#${bookingId}) at ${restaurantName}`,
    text: `
Hi ${customerName},

Thank you for choosing ${restaurantName}!

We’ve received your booking request:
- Booking ID: ${bookingId}
- Date: ${bookingDate}
- Time: ${bookingTime}
- Guests: ${guests}

Your request is currently **pending approval** by the restaurant.  
You’ll receive a confirmation email once it’s accepted.

Best regards,  
${restaurantName} Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:#2c3e50;">Booking Request Received</h2>
        <p>Hi <strong>${customerName}</strong>,</p>
        <p>Thank you for choosing <strong>${restaurantName}</strong>!</p>
        <p>We’ve received your booking request:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
          <li><strong>Date:</strong> ${bookingDate}</li>
          <li><strong>Time:</strong> ${bookingTime}</li>
          <li><strong>Guests:</strong> ${guests}</li>
            ${
              Array.isArray(table_selections) && table_selections.length
                ? table_selections
                    .map(
                      (sel: any) =>
                        `<li><strong>Table Name:</strong> ${sel.tableType || "N/A"}<br/><strong>Quantity:</strong> ${sel.qty || 1}</li>`
                    )
                    .join("")
                : ""
            }
        </ul>
        <p>Your request is currently <strong>pending approval</strong> by the restaurant.<br/>
        You’ll receive a confirmation email once it’s accepted.</p>
        <p>Best regards,<br/>${restaurantName} Team</p>
      </div>
    `,
  };
}

export function bookingRequestOwnerTemplate({
  bookingId,
  customerName,
  customerEmail,
  customerPhone, // ✅ added
  restaurantName,
  bookingDate,
  bookingTime,
  guests,
  approveUrl,
  rejectUrl,
  table_selections,
}: {
  bookingId: string | number;
  customerName: string;
  customerEmail: string;
  customerPhone: string; // ✅ added
  restaurantName: string;
  bookingDate: string;
  bookingTime: string;
  guests: number;
  approveUrl: string;
  rejectUrl: string;
  table_selections?: any[];
}) {
  return {
    subject: `New Booking Request (#${bookingId}) for ${restaurantName}`,
    text: `
Hello ${restaurantName} Team,

You have received a new booking request:

- Booking ID: ${bookingId}
- Customer: ${customerName} (${customerEmail})
- Phone: ${customerPhone}
- Date: ${bookingDate}
- Time: ${bookingTime}
- Guests: ${guests}

Please approve or reject this booking:

Approve: ${approveUrl}
Reject: ${rejectUrl}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:#2c3e50;">New Booking Request</h2>
        <p style="text-transform: capitalize;">Hello <strong>${restaurantName} Team</strong>,</p>
        <p>You have received a new booking request:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
          <li><strong>Customer:</strong> ${customerName} (${customerEmail})</li>
          <li><strong>Phone:</strong> ${customerPhone}</li>
          <li><strong>Date:</strong> ${bookingDate}</li>
          <li><strong>Time:</strong> ${bookingTime}</li>
          <li><strong>Guests:</strong> ${guests}</li>
            ${
              Array.isArray(table_selections) && table_selections.length
                ? table_selections
                    .map(
                      (sel: any) =>
                        `<li><strong>Table Name:</strong> ${sel.tableType || "N/A"}<br/><strong>Quantity:</strong> ${sel.qty || 1}</li>`
                    )
                    .join("")
                : ""
            }
        </ul>
        <p>Please approve or reject this booking:</p>
        <div style="margin-top:20px;">
          <a href="${approveUrl}" style="background-color:#27ae60;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;margin-right:10px;">✅ Approve</a>
          <a href="${rejectUrl}" style="background-color:#e74c3c;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">❌ Reject</a>
        </div>
        <p style="margin-top:20px;">Best regards,<br/>Booking System</p>
      </div>
    `,
  };
}

export default factories.createCoreController(
  "api::booking.booking",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const restaurantEmail = strapi.config.get(
          "server.restaurantEmail",
          process.env.RESTAURANT_EMAIL
        );
        const restaurantName = strapi.config.get(
          "server.restaurantName",
          process.env.RESTAURANT_NAME
        );
        const {
          name,
          email,
          startAt,
          endAt,
          table_selections,
          guests = 1,
          message,
          phone, // ✅ added
        } = ctx.request.body;
        const data = {
          customer_name: name,
          email,
          booking_startAt: startAt,
          booking_endAt: endAt,
          booking_status: "pending", // ✅ correct field
          guests,
          message: message || null,
          publishedAt: null,
          booking_id: generateBookingId(),
          table_selections: table_selections || [], // sel should be array of component values
          customerPhone: phone, // ✅ added
        };
        // ✅ validations
        if (!data.customer_name) return ctx.badRequest("Name is required");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
          return ctx.badRequest("Invalid email address");
        if (isNaN(Date.parse(data.booking_startAt)))
          return ctx.badRequest("Invalid start date");
        if (isNaN(Date.parse(data.booking_endAt)))
          return ctx.badRequest("Invalid end date");
        if (new Date(data.booking_endAt) <= new Date(data.booking_startAt))
          return ctx.badRequest("End date must be after start date");
        // ✅ create booking
        const booking = await strapi.db
          .query("api::booking.booking")
          .create({ data });
        const template_consumer = bookingRequestConsumerTemplate({
          bookingId: data.booking_id,
          customerName: data.customer_name,
          restaurantName: restaurantName, // Replace with actual restaurant name if available
          bookingDate: data.booking_startAt,
          bookingTime: new Date(data.booking_startAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          guests: ctx.request.body.guests ?? 1, // Replace with actual guests value if available
          table_selections,
        });
        const template_owner = bookingRequestOwnerTemplate({
          bookingId: data.booking_id,
          customerName: data.customer_name,
          customerEmail: data.email,
          restaurantName: restaurantName, // Replace with actual restaurant name if available
          bookingDate: data.booking_startAt,
          bookingTime: new Date(data.booking_startAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          guests: ctx.request.body.guests ?? 1, // Replace with actual guests value if available
          approveUrl: `${process.env.BASE_URL_CMS}/admin/plugins/booking-approval/bookings/${booking?.documentId}`, // Replace with actual URL
          rejectUrl: `${process.env.BASE_URL_CMS}/admin/plugins/booking-approval/bookings/${booking?.documentId}`, // Replace with actual URL
          table_selections,
          customerPhone: data.customerPhone || "N/A", // ✅ added
        });
        try {
          // await strapi.plugin("email").service("email").send({
          await strapi.service("api::email.brevo").sendEmail({
            to: data.email,
            subject: template_consumer.subject,
            text: template_consumer.text,
            html: template_consumer.html,
          });
          // await strapi.plugins["email"].services.email.send({
          await strapi.service("api::email.brevo").sendEmail({
            to: restaurantEmail,
            subject: template_owner.subject,
            text: template_owner.text,
            html: template_owner.html,
          });
          strapi.log.info("✅ Email sent successfully");
        } catch (err) {
          console.log({ err_email: err });
          strapi.log.error("❌ Email sending failed", err);
        }

        // 3. Send email to restaurant owner

        return booking;
      } catch (err) {
        console.log(err);
        ctx.throw(500, err);
      }
    },
  })
);
