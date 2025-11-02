import { Request, Response } from "express";
import { transactionService } from "../../services/v1/transaction.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const transactionController = {
  async create(req: Request, res: Response) {
    try {
      const transaction = await transactionService.create(req.body);
      res.status(201).json(ApiResponse.success("Transaction created", transaction));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Failed to create transaction", error));
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const transactions = await transactionService.getAll(req.query);
      res.json(ApiResponse.success("Fetched transactions", transactions));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Failed to fetch transactions", error));
    }
  },

  async update(req: Request, res: Response) {
    try {
      const updated = await transactionService.update(req.params.id, req.body);
      if (!updated)
        return res.status(404).json(ApiResponse.error("Transaction not found"));
      res.json(ApiResponse.success("Transaction updated", updated));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Failed to update transaction", error));
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const deleted = await transactionService.remove(req.params.id);
      if (!deleted)
        return res.status(404).json(ApiResponse.error("Transaction not found"));
      res.json(ApiResponse.success("Transaction deleted", deleted));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Failed to delete transaction", error));
    }
  },
  async getDasboardSatats(req: Request, res: Response) {
    try {
      const data = await transactionService.getDashboardStats();
      res.json(ApiResponse.success("Fetched transactions data", data));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Failed to delete transaction", error));
    }
  },
};
