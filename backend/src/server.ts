import app from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";

const start = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${ENV.PORT}/api/${ENV.API_VERSION}`);
  });
};

start();
