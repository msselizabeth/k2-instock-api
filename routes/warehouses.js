import express from "express";
import {
  getAllWarehouses,
  getWarehouseById,
  getInventoriesFromWarehouse,
} from "../controllers/warehouses-controller.js";

const router = express.Router();

router.get("/", getAllWarehouses);

router.get("/:id", getWarehouseById);

// Route to get inventories for a given warehouse
router.get("/:id/inventories", getInventoriesFromWarehouse);

export default router;