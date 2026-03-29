require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const Transaction = require("./models/Transaction");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Expense Tracker API is working");
});

app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error("GET transactions error:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

app.post("/transactions", async (req, res) => {
  try {
    const { title, amount, type, category } = req.body;

    const newTransaction = new Transaction({
      title,
      amount,
      type,
      category,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("POST transaction error:", error);
    res.status(500).json({ message: "Error creating transaction" });
  }
});

app.delete("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("DELETE transaction error:", error);
    res.status(500).json({ message: "Error deleting transaction" });
  }
});

app.get("/summary", async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const balance = income - expense;

    res.json({ income, expense, balance });
  } catch (error) {
    console.error("GET summary error:", error);
    res.status(500).json({ message: "Error fetching summary" });
  }
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
