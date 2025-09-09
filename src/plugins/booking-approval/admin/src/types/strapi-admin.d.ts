// src/plugins/booking-approval/admin/src/types/strapi-admin.d.ts
export interface StrapiApp {
  getPlugin: (
    id: string // only plugin id is required
  ) => {
    config?: {
      publicEnv?: Record<string, string>;
    };
  };
}
