import path from "path";

// module.exports = ({ env }) => ({
//   connection: {
//     client: "postgres",
//     connection: {
//       connectionString: env("DATABASE_URL"),
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     useNullAsDefault: true,
//   },
// });

// config/database.ts
module.exports = ({ env }) => ({
  connection: {
    client: "sqlite",
    connection: {
      filename: env("DATABASE_FILENAME", "./data/data.db"),
    },
    useNullAsDefault: true,
  },
});
