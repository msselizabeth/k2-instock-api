import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhoneNumber = (phone) => /^\+?[1-9]\d{1,14}$/.test(phone);

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

export const createWarehouse = async (req, res) => {
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
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({ message: "All fields are required"});
  }
  if (!isValidEmail(contact_email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }
  if (!isValidPhoneNumber(contact_phone)) {
    return res.status(400).json({ message: "Invalid phone number format."});
  }

  try {
    const [newWarehouse] = await knex("warehouse")
      .insert({
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      })
      .returning([
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email",
      ]);
    
    res.status(201).json(newWarehouse);
  } catch (error) {
    res.status(500).json({ message: "Ensure creating warehouse" });
  }
  
};

export { getAllWarehouses, getWarehouseById };
