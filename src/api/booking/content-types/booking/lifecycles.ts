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
const restaurantName = strapi.config.get(
  "server.restaurantName",
  process.env.RESTAURANT_NAME
);

export default {
  async afterUpdate(event) {
    const { result } = event;

    const prevEntry = await strapi.db.query("api::booking.booking").findOne({
      where: { id: result.id },
      select: [
        "booking_status",
        "customer_name",
        "booking_id",
        "booking_startAt",
        "guests",
        "email",
      ],
    });
    

    // Only send email if status changed 
    if (prevEntry.booking_status === result.booking_status) {
      return;
    }

    const template_consumer = bookingConfirmedConsumerTemplate({
      bookingId: result.booking_id,
      customerName: result.customer_name,
      restaurantName: restaurantName,
      bookingDate: result.booking_startAt.split("T")[0],
      bookingTime: result.booking_startAt.split("T")[1].substring(0, 5),
      guests: result.guests || 0,
    });
    if (result?.email) {
      try {
        await strapi.plugin("email").service("email").send(
      
          {
          to: result.email,
          subject: template_consumer.subject,
          text: template_consumer.text,
          html: template_consumer.html,
        }
      
      );
      } catch (err) {
        strapi.log.error("Email sending failed:", err);
      }
    }
  },
};
