import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await knex("warehouses").select(
      "warehouses.id",
      "warehouse_name",
      "warehouse.address",
      "warehouse.city",
      "warehouse.country",
      "warehouse.contact_name",
      "warehouse.contact_position",
      "warehouse.contact_phone",
      "warehouse.contact_email"
    );
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: "Error getting warehouses" });
  }
};

const getWarehouseById = async (req, res) => {
  try {
    const warehouseItem = await knex("warehouses")
      .select(
        "warehouse.id",
        "warehouse_name",
        "warehouse.address",
        "warehouse.city",
        "warehouse.country",
        "warehouse.contact_name",
        "warehouse.contact_position",
        "warehouse.contact_phone",
        "warehouse.contact_email"
      )
      .where("warehouse.id", req.params.id)
      .first();

    if (!warehouseItem) {
      return res.status(404).json({
        message: `Warehouse not found with id: ${req.params.id}`,
      });
    }

    res.json(warehouseItem);
  } catch (error) {
    res.status(500).json({ message: "Error getting single warehouse" });
  }
};

export { getAllWarehouses, getWarehouseById };
