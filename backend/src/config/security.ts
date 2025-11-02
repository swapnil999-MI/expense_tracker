import cors, { CorsOptions } from "cors";
import helmet from "helmet";

export const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:5173", // local frontend
    "https://your-production-domain.com", // production frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // allow cookies if needed
};

export const helmetOptions: Parameters<typeof helmet>[0] = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "*"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false,
};
