// config/plugins.js - Add auto optimization
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "smtp.example.com"),
        port: env("SMTP_PORT", 587),
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
        // Uncomment for SSL
        // secure: true,
      },
      settings: {
        defaultFrom: env("SMTP_DEFAULT_FROM", "no-reply@moncees.com"),
        defaultReplyTo: env("SMTP_DEFAULT_REPLY_TO", "contact@moncees.com"),
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
});
