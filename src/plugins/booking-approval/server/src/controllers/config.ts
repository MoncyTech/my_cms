export default {
  async getConfig(ctx) {
    const pluginConfig = strapi.config.get('plugin.booking-approval');
    ctx.body = {
      publicEnv: pluginConfig ?? {},
    };
  },
};
