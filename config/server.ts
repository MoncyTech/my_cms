export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  restaurantEmail: env("RESTAURANT_EMAIL"),
  restaurantName: String(env("RESTAURANT_NAME"))
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()),
});
