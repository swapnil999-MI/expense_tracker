import { Router } from "express";
import { transactionController } from "../../controllers/v1/transaction.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../../validations/transaction.validation";

const router = Router();

router.get("/", transactionController.getAll);
router.post("/", validateRequest(createTransactionSchema), transactionController.create);
router.put("/:id", validateRequest(updateTransactionSchema), transactionController.update);
router.delete("/:id", transactionController.remove);
router.get("/dashboard_data/", transactionController.getDasboardSatats);

export default router;
