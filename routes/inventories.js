import express from "express";
import {
  getAllInventories,
  getInventoryById,
} from "../controllers/inventory-controller.js";

const router = express.Router();

// Route to get list of all inventory items
router.get("/", getAllInventories);

// Route to get single inventory item
router.get("/:id", getInventoryById);

export default router;
