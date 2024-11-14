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
    // console.error("error:", error);
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

const deleteWarehouseByID = async (req, res) => {
  const { id } = req.params;
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

const updateWarehouse = async (req, res) => {
  const warehouseId = req.params.id;
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

  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position
  ) {
    return res.status(400).json({ message: "All fields must be filled out" });
  }

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!contact_email.trim() || !emailRegex.test(contact_email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Phone number validation
  const phoneRegex =
    /^\+?[1-9]{1}[0-9]{1,14}(\s?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,4})$/;
  if (!contact_phone.trim() || !phoneRegex.test(contact_phone)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  try {
    const existingWarehouse = await knex("warehouses")
      .where("id", warehouseId)
      .first();
    if (!existingWarehouse) {
      return res.status(404).json({
        message: `Warehouse with id ${warehouseId} not found`,
      });
    }

    const updateData = {
      warehouse_name: warehouse_name.trim(),
      address: address.trim(),
      city: city.trim(),
      country: country.trim(),
      contact_name: contact_name.trim(),
      contact_position: contact_position.trim(),
      contact_phone: contact_phone.trim(),
      contact_email: contact_email.trim(),
    };

    await knex("warehouses").where("id", warehouseId).update(updateData);

    const updatedWarehouse = await knex("warehouses")
      .select(
        "warehouses.id",
        "warehoues.warehouse_name",
        "warehouses.address",
        "warehouses.city",
        "warehouses.country",
        "warehouses.contact_name",
        "warehouses.contact_position",
        "warehouses.contact_phone",
        "warehouses.contact_email"
      )
      .where("warehouses.id", warehouseId)
      .first();

    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: "Error updating warehouse", error });
  }
};

export {
  getAllWarehouses,
  getWarehouseById,
  getInventoriesFromWarehouse,
  deleteWarehouseByID,
  updateWarehouse,
};
