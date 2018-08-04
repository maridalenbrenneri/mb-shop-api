import * as express from "express";
import * as bodyParser from "body-parser";

import dotenv = require("dotenv");
dotenv.config();

const app = express();

app.set("port", process.env.PORT || 5002);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Controllers (route handlers)
import * as productController from "./controllers/product";
import { env } from "process";

// Main routes
app.get("/api/products", productController.getAllProducts);
app.get("/api/products/:id", productController.getProduct);

console.log('NODE_ENV: ' + process.env.NODE_ENV);
console.log('DATABASE_URL: ' + process.env.DATABASE_URL);

export default app;
