import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import routers
import warehousesRoutes from "./routes/warehouses.js";
import inventoriesRoutes from "./routes/inventories.js";

dotenv.config();
const app = express();
const { PORT, BACKEND_URL,CORS_ORIGIN } = process.env;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/api", async (req, res) => {
    res.status(200).json({message: "Welcome to Instock API"})
   });

app.use("/api/warehouses", warehousesRoutes);
app.use("/api/inventories", inventoriesRoutes);


// processing unsupported routes
app.use((req, res ) => {
    res.status(404).json({
        message: "Route not found",
    });
});

// start server
app.listen(PORT, () => {
    console.log(`Server is listening at ${BACKEND_URL}:${PORT}`);
  });
