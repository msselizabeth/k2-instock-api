import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all inventory items
const getAllInventories = async (req, res) => {
  try {
    const inventories = await knex("inventories")
      // Join the two tables to get the warehouse name
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
    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({ message: "Error getting inventories" });
  }
};

// Get a single inventory item by ID
const getInventoryById = async (req, res) => {
  try {
    const inventoryItem = await knex("inventories")
      // Join the two tables to get the warehouse name
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name as warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      // Here we are getting the id of the item
      .where("inventories.id", req.params.id)
      .first();

    // Item not found
    if (!inventoryItem) {
      return res.status(404).json({
        message: `Inventory item not found with id: ${req.params.id}`,
      });
    }
    //  Only return if inventory item has been found
    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: "Error getting single inventory item" });
  }
};

const updateInventory = async (req, res) => {
  const inventoryId = req.params.id;
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  if (
    !warehouse_id ||
    !item_name.trim() ||
    !description.trim() ||
    !category.trim() ||
    !status.trim() ||
    quantity === undefined ||
    quantity === null ||
    quantity === ""
  ) {
    return res.status(400).json({ message: "All fields must be filled out" });
  }

  if (isNaN(quantity) || !Number.isFinite(Number(quantity))) {
    return res.status(400).json({
      message: `Quantity must be a valid number`,
    });
  }

  try {
    const existingInventory = await knex("inventories")
      .where("id", inventoryId)
      .first();

    if (!existingInventory) {
      return res.status(404).json({
        message: `${inventoryId} not found`,
      });
    }

    const warehouseExists = await knex("warehouses")
      .where("id", warehouse_id)
      .first();

    if (!warehouseExists) {
      return res.status(400).json({
        message: `Warehouse with ID ${warehouse_id} does not exist`,
      });
    }

    const updateData = {
      warehouse_id: warehouse_id,
      item_name: item_name,
      description: description,
      category: category,
      status: quantity === 0 ? "Out Of Stock" : "In Stock",
      quantity: Number(quantity),
    };

    await knex("inventories").where("id", inventoryId).update(updateData);

    const updatedInventory = await knex("inventories")
      .select(
        "warehouse_id",
        "item_name",
        "description",
        "category",
        "status",
        "quantity"
      )
      .where("inventories.id", inventoryId)
      .first();

    res.status(200).json(updatedInventory);
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory", error });
  }
};

export { getAllInventories, getInventoryById, updateInventory };
