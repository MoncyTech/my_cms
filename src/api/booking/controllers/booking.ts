/**
 * booking controller
 */

import { factories } from "@strapi/strapi";
function generateBookingId() {
  const timestamp = Date.now().toString(36).toUpperCase(); // ~6–7 chars
  const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 chars
  return `BK${(timestamp + randomPart).substring(0, 10)}`;
}

export default factories.createCoreController(
  "api::booking.booking",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const { name, email, startAt, endAt } = ctx.request.body;
        const restaurantEmail = strapi.config.get(
          "server.restaurantEmail",
          process.env.RESTAURANT_EMAIL
        );

        const data = {
          customer_name: name,
          email,
          booking_startAt: startAt,
          booking_endAt: endAt,
          status: "pending",
          publishedAt: null,
        };

        data["booking_id"] = generateBookingId();

        if (!data.customer_name) return ctx.badRequest("Name is required");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
          return ctx.badRequest("Invalid email");
        if (isNaN(Date.parse(data.booking_startAt)))
          return ctx.badRequest("Invalid start date");
        if (isNaN(Date.parse(data.booking_endAt)))
          return ctx.badRequest("Invalid end date");
        if (new Date(data.booking_endAt) <= new Date(data.booking_startAt))
          return ctx.badRequest("End date must be after start date");

        // 1. Create booking with status "pending"
        const booking = await strapi.db.query("api::booking.booking").create({
          data,
        });

        try {
          await strapi.plugin("email").service("email").send({
            to: data.email,
            subject: "Booking Requested",
            text: "Test email from Strapi + Brevo",
          });
          strapi.log.info("✅ Email sent successfully");
        } catch (err) {
          strapi.log.error("❌ Email sending failed", err);
        }

        // 3. Send email to restaurant owner
        await strapi.plugins["email"].services.email.send({
          to: restaurantEmail,
          subject: "New Booking Request",
          text: `A new booking request has been made by ${name} (${email}). Please review and confirm.`,
        });

        return booking;
      } catch (err) {
        ctx.throw(500, err);
      }
    },
  })
);
