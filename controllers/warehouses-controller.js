import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await knex("warehouses").select(
      "warehouses.id",
      "warehouses.warehouse_name",
      "warehouses.address",
      "warehouses.city",
      "warehouses.country",
      "warehouses.contact_name",
      "warehouses.contact_position",
      "warehouses.contact_phone",
      "warehouses.contact_email"
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
        "warehouses.id",
        "warehouses.warehouse_name",
        "warehouses.address",
        "warehouses.city",
        "warehouses.country",
        "warehouses.contact_name",
        "warehouses.contact_position",
        "warehouses.contact_phone",
        "warehouses.contact_email"
      )
      .where("warehouses.id", req.params.id)
      .first();

    if (!warehouseItem) {
      return res.status(404).json({
        message: `Warehouse not found with id: ${req.params.id}`,
      });
    }

    res.json(warehouseItem);
  } catch (error) {
    res.status(500).json({ message: "Error getting single warehouse item" });
  }
};

const createWarehouse = async (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;
  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegEx = /^(\+?\d{1,2})?\s?\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/;

  if (!warehouse_name || !warehouse_name.trim()) {
    return res.status(400).json({ message: "Warehouse name is invalid" });
  }
  if (!address || !address.trim()) {
    return res.status(400).json({ message: "Address is invalid" });
  }
  if (!city || !city.trim()) {
    return res.status(400).json({ message: "City is invalid" });
  }
  if (!country || !country.trim()) {
    return res.status(400).json({ message: "Country is invalid" });
  }
  if (!contact_name || !contact_name.trim()) {
    return res.status(400).json({ message: "Contact name is invalid" });
  }
  if (!contact_position || !contact_position.trim()) {
    return res.status(400).json({ message: "Contact position is invalid" });
  }
  if (
    !contact_phone ||
    !contact_phone.trim() ||
    !phoneRegEx.test(contact_phone)
  ) {
    return res.status(400).json({ message: "Phone is invalid" });
  }
  if (
    !contact_email ||
    !contact_email.trim() ||
    !emailRegEx.test(contact_email)
  ) {
    return res.status(400).json({ message: "Email is invalid" });
  }
  try {
    const [newWarehouseId] = await knex("warehouses").insert({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });
    const newWarehouse = await knex("warehouses")
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email"
      )
      .where("id", newWarehouseId)
      .first();

    res.status(201).json(newWarehouse);
  } catch (error) {
    res.status(500).json({ message: "Error creating warehouse" });
  }
};

const deleteWarehouseByID = async (req, res) => {
  const { id } = req.params;
  try {
    const warehouseItem = await knex("warehouses")
      .select("warehouses.id")
      .where("warehouses.id", id)
      .first();

    if (!warehouseItem) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${id} not found` });
    }

    await knex("warehouses").where("warehouses.id", id).del();
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting warehouse with Id: ${id}` });
  }
};

// GET /api/warehouses/:id/inventories
const getInventoriesFromWarehouse = async (req, res) => {
  try {
    const inventoryOfWarehouse = await knex("warehouses")
      .join("inventories", "warehouses.id", "=", "inventories.warehouse_id")
      .select(
        "warehouses.id",
        "inventories.item_name",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      // Here we are getting the id of the item
      .where("warehouses.id", req.params.id);

    // Inventory not found
    if (!inventoryOfWarehouse || inventoryOfWarehouse.length === 0) {
      return res.status(404).json({
        message: `Inventory of the warehouse was not found with id: ${req.params.id}`,
      });
    }
    //  Only return if the warehouse inventory has been found
    res.status(200).json(inventoryOfWarehouse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting inventories for a given warehouse." });
  }
};

export {
  getAllWarehouses,
  getWarehouseById,
  getInventoriesFromWarehouse,
  deleteWarehouseByID,
  createWarehouse,
};
