// config/plugins.js - Add auto optimization
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("BREVO_HOST"),
        port: env("BREVO_PORT"),
        auth: {
          user: env("BREVO_USER"), // your brevo login (usually email)
          pass: env("BREVO_KEY"), // brevo api key
        },
      },
      settings: {
        defaultFrom: env("RESTAURANT_EMAIL"),
      },
    },
  },
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {
          folder: "strapi-uploads",
          resource_type: "auto",
          quality: "auto:best", // Auto optimize quality
          format: "auto", // Auto select best format
        },
      },
    },
  },
  "custom-page": {
    enabled: true,
    resolve: "./src/plugins/custom-page",
  },
  "booking-approval": {
    enabled: true,
    resolve: "./src/plugins/booking-approval",
  },
});
