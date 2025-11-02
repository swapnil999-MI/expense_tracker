import express from "express";
import cors from "cors";
import helmet from "helmet";

import { corsOptions, helmetOptions } from "./config/security";
import { errorHandler } from "./middlewares/errorHandler";
import v1Routes from "./routes/v1";
import { ENV } from "./config/env";

const app = express();

// 🔐 Security Middleware
app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(express.json());

// 🧩 Versioned API Entry
app.use(`/api/v1`, v1Routes);

// ⚠️ Global Error Handler
app.use(errorHandler);

export default app;
