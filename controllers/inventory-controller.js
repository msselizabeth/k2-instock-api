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

const createInventory = async (req, res) => {
  const { item_name, description, category, status, quantity, warehouse_id } =
    req.body;

  if (
    !warehouse_id ||
    !item_name.trim() ||
    !description.trim() ||
    !category.trim() ||
    quantity === undefined ||
    quantity === null ||
    quantity === ""
  ) {
    return res.status(400).json({ message: "All fields must be filled out" });
  }

  if (isNaN(quantity) || !Number.isFinite(Number(quantity))) {
    return res.status(400).json({ message: "Quantity must be a valid number" });
  }

  const warehouseExists = await knex("warehouses")
    .where("id", warehouse_id)
    .first();
  if (!warehouseExists) {
    return res
      .status(400)
      .json({ message: `Warehouse with ID ${warehouse_id} does not exist` });
  }

  try {
    const status = quantity === 0 ? "Out Of Stock" : "In Stock";
    
    const [newInventoryId] = await knex("inventories").insert({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity: Number(quantity),
    });

    const newInventory = await knex("inventories")
      .select(
        "id",
        "item_name",
        "description",
        "category",
        "status",
        "quantity",
        "warehouse_id"
      )
      .where("id", newInventoryId)
      .first();

    res.status(201).json(newInventory);
  } catch (error) {
    res.status(500).json({ message: "Error creating inventory item" });
  }
};

const deleteInventoryByID = async (req, res) => {
  const { id } = req.params;
  try {
    const inventoryItem = await knex("inventories")
      .select("inventories.id")
      .where("inventories.id", id)
      .first();

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ message: `Inventory with ID ${id} not found` });
    }

    await knex("inventories").where("inventories.id", id).del();
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting inventory with Id: ${id}` });
  }
};

export {
  getAllInventories,
  getInventoryById,
  deleteInventoryByID,
  createInventory,
};
