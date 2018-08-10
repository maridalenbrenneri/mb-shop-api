import * as express from "express";
import * as bodyParser from "body-parser";

import dotenv = require("dotenv");
dotenv.config();

const app = express();

app.set("port", process.env.PORT || 5002);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Controllers (route handlers)
import adminController from "./controllers/admin";
import productController from "./controllers/product";

// Admin routes
app.post("/api/admin/create-tables", adminController.createTable);
app.post("/api/admin/create-product", adminController.createProduct);
app.post("/api/admin/update-product", adminController.updateProduct);

// Main routes
app.get("/api/products", productController.getAllProducts);
app.get("/api/products/:id", productController.getProduct);

console.log('NODE_ENV: ' + process.env.NODE_ENV);
// console.log('DATABASE_URL: ' + process.env.DATABASE_URL);

export default app;
