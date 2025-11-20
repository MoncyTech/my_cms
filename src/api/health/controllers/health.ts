import { v2 as cloudinary } from "cloudinary";

export default {
  async check(ctx) {
    let cloudinaryStatus = "ok";

    try {
      // REAL outbound network call
     await cloudinary.api.ping();
  
    } catch (err) {
      cloudinaryStatus = "error";
    }

    ctx.body = {
      status: "ok",
      cloudinary: cloudinaryStatus,
      timestamp: Date.now(),
      
    };
  },
};
