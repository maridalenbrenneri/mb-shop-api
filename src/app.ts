import * as express from "express";
import { Response, Request } from "express";
import * as bodyParser from "body-parser";

import dotenv = require("dotenv");
dotenv.config();

const app = express();

app.set("port", process.env.PORT || 5002);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set allowed origin 
app.use(function (req: Request, res: Response, next: any) {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader('Access-Control-Allow-Headers', ['content-type', 'x-access-token']);
    next();
});

// Validate api key
app.use(function (req: Request, res: Response, next: any) : Boolean {
    var provider = req.get('X-Header-Provider');
    return next();
});

function isAuthenticated(req: Request, res: Response, next: any) : Boolean {

    return next();
}

function isUserInStoreManagerOrAbove(req: Request, res: Response, next: any) : Boolean {
    return next();
}

function isUserInAdmin(req: Request, res: Response, next: any) : Boolean {
    return next();
}

function onOrderCreate(req: Request, res: Response, next: any) {
    console.log("Order started...");
    next();
}

function onOrderCreated(req: Request, res: Response, next: any) {
    console.log("Order completed.");
    next();
}

// Controllers (route handlers)
import adminController from './controllers/admin';
import authController from './controllers/auth';
import productController from './controllers/product';
import orderController from './controllers/order';

// Admin routes
app.post("/api/admin/create-tables", isUserInAdmin, adminController.createTable);

// Main routes
app.post("/api/authenticate", authController.authenticate);
app.get("/api/users/me", isAuthenticated, authController.getMe);
app.get("/api/users", isUserInStoreManagerOrAbove, authController.getUsers);
app.post("/api/users", authController.registerUser);

app.get("/api/products", productController.getProducts);
app.get("/api/products/:id", productController.getProduct);
app.post("/api/products", isUserInStoreManagerOrAbove, productController.createProduct);
app.put("/api/products/:id", isUserInStoreManagerOrAbove, productController.updateProduct);

app.get("/api/orders", isUserInStoreManagerOrAbove, orderController.getOrders);
app.get("/api/orders/:id", isAuthenticated, orderController.getOrders);
app.post("/api/orders", isAuthenticated, orderController.createOrder);
// app.put("/api/orders/:id", isAuthenticated, orderController.getOrders);

console.log('NODE_ENV: ' + process.env.NODE_ENV);
// console.log('DATABASE_URL: ' + process.env.DATABASE_URL);

export default app;
