import * as express from "express";
import { Response, Request } from "express";
import * as bodyParser from "body-parser";
import * as jwt from 'jsonwebtoken';
import logger from "./utils/logger";

// Load environemnt variables
require('dotenv').config();

function isAuthenticated(req: Request, res: Response, next: any) : Boolean {

    // todo: DEV STUFF - TO BEREMOVED
    // return next();

    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send();
    }

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err || !decoded) {
            return res.status(401).send();
        }

        req.user = {
            id: decoded.id
        }

        return next();
    });
}

function isUserInStoreManagerOrAbove(req: Request, res: Response, next: any) : Boolean {
    return next();
}

function isUserInAdmin(req: Request, res: Response, next: any) : Boolean {
    return next();
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set allowed origin 
app.use(function (req: Request, res: Response, next: any) {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', ['content-type', 'x-access-token']);
    next();
});

// Validate api key
app.use(function (req: Request, res: Response, next: any) : Boolean {
    var provider = req.get('X-Header-Provider');
    return next();
});

app.set("port", process.env.PORT || 5002);

import adminController from './controllers/admin';
import authController from './controllers/auth';
import customerController from './controllers/customer';
import productController from './controllers/product';
import orderController from './controllers/order';
import subscriptionController from './controllers/subscription';
import { ValidationError } from "./models/validation-error";

/*** API ***/

// Admin routes
app.post("/api/admin/create-tables", isUserInAdmin, adminController.createTable);
app.post("/api/products/create-many", isUserInAdmin, productController.createProducts);

// User and auth
app.post("/api/authenticate", authController.authenticate);
app.get("/api/users/me", isAuthenticated, authController.getMe);
app.get("/api/users", isUserInStoreManagerOrAbove, authController.getUsers);
app.post("/api/users", authController.registerUser);

// Customers
app.get("/api/customers", customerController.getCustomers);
app.get("/api/customers/:id", customerController.getCustomer);
app.post("/api/customers", isUserInStoreManagerOrAbove, customerController.createCustomer);
app.put("/api/customers/:id", isUserInStoreManagerOrAbove, customerController.updateCustomer);

// Products
app.get("/api/products", productController.getProducts);
app.get("/api/products/:id", productController.getProduct);
app.post("/api/products", isUserInStoreManagerOrAbove, productController.createProduct);
app.put("/api/products/:id", isUserInStoreManagerOrAbove, productController.updateProduct);

// Orders
app.get("/api/orders/:id", isAuthenticated, orderController.getOrders);
app.get("/api/orders/mine", isAuthenticated, orderController.getMyOrders);
app.post("/api/orders", isUserInStoreManagerOrAbove, orderController.createOrder);
app.get("/api/orders", isUserInStoreManagerOrAbove, orderController.getOrders);
app.post("/api/orders/:id/complete", isUserInStoreManagerOrAbove, orderController.completeOrder);
app.post("/api/orders/:id/cancel", isUserInStoreManagerOrAbove, orderController.cancelOrder);
app.post("/api/orders/:id/process", isUserInStoreManagerOrAbove, orderController.processOrder);
app.post("/api/orders/:id/notes", isUserInStoreManagerOrAbove, orderController.addOrderNote);

// Subscriptions
app.get("/api/subscriptions/mine", isAuthenticated, subscriptionController.getSubscriptions);
app.post("/api/subscriptions/:id/activate", isAuthenticated, subscriptionController.activateSubscription);
app.post("/api/subscriptions/:id/pause", isAuthenticated, subscriptionController.pauseSubscription);
app.post("/api/subscriptions/:id/cancel", isAuthenticated, subscriptionController.startCancelSubscription);
app.get("/api/subscriptions", isUserInStoreManagerOrAbove, subscriptionController.getSubscriptions);
app.get("/api/subscriptions/data/delivery-dates", isUserInStoreManagerOrAbove, subscriptionController.getNextStandardDeliveryDates);
app.post("/api/subscriptions/:id/complete-cancel", isUserInStoreManagerOrAbove, subscriptionController.completeCancelSubscription);
app.post("/api/subscription/engine/create-renewal-orders", isUserInStoreManagerOrAbove, subscriptionController.createRenewalOrders);

/*** END API ***/ 

// Error handling
app.use(function (err, req, res, next) {

    if (err instanceof ValidationError) {
        return res.status(422).send({validationError: err.message});
    } 

    logger.error(err.message);
    return res.status(500).send({error: err.message});
 });

// console.log('NODE_ENV: ' + process.env.NODE_ENV);
// console.log('DATABASE_URL: ' + process.env.DATABASE_URL);

export default app;
