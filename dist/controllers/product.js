"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
/**
 * GET /products/:id
 */
exports.getProduct = (req, res) => {
    var productId = req.params.id;
    var provider = req.get('X-Header-Provider');
    res.send("Hello from products route " + productId);
};
/**
 * GET /products
 * Get all products
 */
exports.getAllProducts = (req, res) => {
    var productId = req.params.id;
    var provider = req.get('X-Header-Provider');
    logger_1.default.info("all products was requested");
    res.send("All products");
};
//# sourceMappingURL=product.js.map