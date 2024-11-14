import express from "express";
import {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
} from "../controllers/warehouses-controller.js";

const router = express.Router();

router.get("/", getAllWarehouses)
router.get("/:id", getWarehouseById);
router.post("/", createWarehouse);

export default router;