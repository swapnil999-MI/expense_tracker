import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  type: "income" | "expense";
  amount: number;
  description?: string;
  category: string;
  date: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
