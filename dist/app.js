"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set("port", process.env.PORT || 5002);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Controllers (route handlers)
const productController = require("./controllers/product");
// Main routes
app.get("/api/products", productController.getAllProducts);
exports.default = app;
//# sourceMappingURL=app.js.map