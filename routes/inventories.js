import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";

const router = express.Router();
const knex = initKnex(configuration);

// Route to get list of all inventory items
router.route("/").get(async (req, res) => {
  try {
    const inventories = await knex("inventories")
      // Join to get warehouse name from warehouse table
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name as warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );
    res.json(inventories);
  } catch {
    res.status(500).json({
      message: "Error getting inventories",
    });
  }
});

export default router;
