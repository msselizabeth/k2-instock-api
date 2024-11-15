import express from "express";
import {
  deleteInventoryByID,
  getAllInventories,
  getInventoryById,
  updateInventory,
  createInventory,
} from "../controllers/inventory-controller.js";

const router = express.Router();

// Route to get list of all inventory items
router.get("/", getAllInventories);

// Route to get single inventory item
router.get("/:id", getInventoryById);

router.put("/:id", updateInventory);

// Route to create a new inventory item 
router.post("/", createInventory);

// Route to delete inventory by ID
router.delete("/:id", deleteInventoryByID);

export default router;
