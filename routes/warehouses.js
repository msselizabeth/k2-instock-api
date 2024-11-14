import express from "express";
import {
  deleteWarehouseByID,
  getAllWarehouses,
  getWarehouseById,
} from "../controllers/warehouses-controller.js";

const router = express.Router();

// get All warehouses
router.get("/", getAllWarehouses);

// Get one warehouse by ID
router.get("/:id", getWarehouseById);

// deleting warehouse
router.delete("/:id", deleteWarehouseByID)

export default router;