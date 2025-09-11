// config/constants.ts
export default ({
  env,
}: {
  env: (key: string, defaultValue?: string) => string;
}) => ({
  APP_NAME: env("APP_NAME", "DefaultApp"),
  strapi_key: env("STRAPI_KEY", null),
});
