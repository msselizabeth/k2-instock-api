import express from "express";
import {
  getAllWarehouses,
  getWarehouseById,
} from "../controllers/warehouses-controller.js";

const router = express.Router();

router.get("/", getAllWarehouses);

router.get("/:id", getWarehouseById);

export default router;