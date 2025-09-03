function bookingConfirmedConsumerTemplate({
  bookingId,
  customerName,
  restaurantName,
  bookingDate,
  bookingTime,
  guests,
}: {
  bookingId: string | number;
  customerName: string;
  restaurantName: string;
  bookingDate: string;
  bookingTime: string;
  guests: number;
}) {
  return {
    subject: `Booking Confirmed (#${bookingId}) at ${restaurantName}`,
    text: `
Hi ${customerName},

Good news! Your booking at ${restaurantName} has been confirmed. 🎉

Here are your booking details:
- Booking ID: ${bookingId}
- Date: ${bookingDate}
- Time: ${bookingTime}
- Guests: ${guests}

We look forward to hosting you!  

Best regards,  
${restaurantName} Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:#27ae60;">Booking Confirmed 🎉</h2>
        <p>Hi <strong>${customerName}</strong>,</p>
        <p>Good news! Your booking at <strong>${restaurantName}</strong> has been <span style="color:#27ae60; font-weight:bold;">confirmed</span>.</p>
        <p>Here are your booking details:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
          <li><strong>Date:</strong> ${bookingDate}</li>
          <li><strong>Time:</strong> ${bookingTime}</li>
          <li><strong>Guests:</strong> ${guests}</li>
        </ul>
        <p>We look forward to hosting you!</p>
        <p>Best regards,<br/>${restaurantName} Team</p>
      </div>
    `,
  };
}

function bookingRejectedConsumerTemplate({
  bookingId,
  customerName,
  restaurantName,
  bookingDate,
  bookingTime,
  guests,
  reason,
}: {
  bookingId: string | number;
  customerName: string;
  restaurantName: string;
  bookingDate: string;
  bookingTime: string;
  guests: number;
  reason?: string;
}) {
  const rejectionReason =
    reason ||
    "Unfortunately, we are fully booked for your requested time slot.";

  return {
    subject: `Booking Declined (#${bookingId}) at ${restaurantName}`,
    text: `
Hi ${customerName},

We apologize, but your booking at ${restaurantName} has been declined. ❌

Here were your booking details:
- Booking ID: ${bookingId}
- Date: ${bookingDate}
- Time: ${bookingTime}
- Guests: ${guests}

Reason: ${rejectionReason}

We sincerely apologize for any inconvenience. Please feel free to try booking for alternative dates or times.

Best regards,  
${restaurantName} Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:#e74c3c;">Booking Declined ❌</h2>
        <p>Hi <strong>${customerName}</strong>,</p>
        <p>We apologize, but your booking at <strong>${restaurantName}</strong> has been <span style="color:#e74c3c; font-weight:bold;">declined</span>.</p>
        <p>Here were your booking details:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
          <li><strong>Date:</strong> ${bookingDate}</li>
          <li><strong>Time:</strong> ${bookingTime}</li>
          <li><strong>Guests:</strong> ${guests}</li>
        </ul>
        <p><strong>Reason:</strong> ${rejectionReason}</p>
        <p>We sincerely apologize for any inconvenience. Please feel free to try booking for alternative dates or times.</p>
        <p>Best regards,<br/>${restaurantName} Team</p>
      </div>
    `,
  };
}
const restaurantName = strapi.config.get(
  "server.restaurantName",
  process.env.RESTAURANT_NAME
);

export default {
  // Store previous state in beforeUpdate
  async beforeUpdate(event) {
    const { where } = event.params;

    // Get the current state before update
    const prevEntry = await strapi.db.query("api::booking.booking").findOne({
      where,
      select: [
        "booking_status",
        "customer_name",
        "booking_id",
        "booking_startAt",
        "guests",
        "email",
      ],
    });

    // Store in event params for use in afterUpdate
    event.params.previousData = prevEntry;
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const prevEntry = params.previousData;

    console.log({ new_status: result.booking_status, prevEntry });

    // Only send email if status changed
    if (prevEntry?.booking_status === result.booking_status) {
      console.log("Booking status unchanged, no email sent.");
      return;
    }

    let template_consumer =
      result.booking_status == "accepted" &&
      bookingConfirmedConsumerTemplate({
        bookingId: result.booking_id,
        customerName: result.customer_name,
        restaurantName: restaurantName,
        bookingDate: result.booking_startAt.split("T")[0],
        bookingTime: result.booking_startAt.split("T")[1].substring(0, 5),
        guests: result.guests || 0,
      });

    if (result.booking_status == "rejected") {
      template_consumer = bookingRejectedConsumerTemplate({
        bookingDate: result.booking_startAt.split("T")[0],
        bookingId: result.booking_id,
        customerName: result.customer_name,
        restaurantName: restaurantName,
        bookingTime: result.booking_startAt.split("T")[1].substring(0, 5),
        guests: result.guests || 0,
        reason: result.message || "",
      });
    }

    if (result?.email && template_consumer) {
      try {
        await strapi.plugins["email"].services.email.send({
          to: result.email,
          subject: template_consumer.subject,
          text: template_consumer.text,
          html: template_consumer.html,
        });
      } catch (err) {
        strapi.log.error("Email sending failed:", err);
      }
    }
  },
};
