import express from "express";
import {
  deleteWarehouseByID,
  getAllWarehouses,
  getWarehouseById,
  getInventoriesFromWarehouse,
  createWarehouse,
} from "../controllers/warehouses-controller.js";

const router = express.Router();

// get All warehouses
router.get("/", getAllWarehouses);

// Get one warehouse by ID
router.get("/:id", getWarehouseById);

// Create a New Warehouse
router.post("/", createWarehouse);

// deleting warehouse
router.delete("/:id", deleteWarehouseByID);

// Route to get inventories for a given warehouse
router.get("/:id/inventories", getInventoriesFromWarehouse);

export default router;