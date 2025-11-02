import { Router } from "express";
import transactionRoutes from "./transaction.routes";

const router = Router();

// Add all v1 routes here
router.use("/transactions", transactionRoutes);

export default router;
