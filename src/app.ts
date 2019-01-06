import * as express from "express";
import { Response, Request } from "express";
import * as bodyParser from "body-parser";
import * as jwt from 'jsonwebtoken';
import logger from "./utils/logger";
import { ValidationError } from "./models/validation-error";

// Load environemnt variables
require('dotenv').config();

function isAuthenticated(req: Request, res: Response, next: any) : Boolean {

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

function isUserInSuperuser(req: Request, res: Response, next: any) : Boolean {
    
    // todo: when more users are added, implement...

    return isAuthenticated(req, res, next);
}

function isUserInAdmin(req: Request, res: Response, next: any) : Boolean {

    // todo: when more users are added, implement...

    return isAuthenticated(req, res, next);
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

import adminController from './controllers/admin';
import authController from './controllers/auth';
import customerController from './controllers/customer';
import productController from './controllers/product';
import orderController from './controllers/order';
import giftSubscriptionController from './controllers/gift-subscription';
import shippingController from './controllers/shipping';


/*** API ***/

// Admin routes
app.post("/api/admin/create-tables", isUserInAdmin, adminController.createTable);
app.get("/api/admin/stats", adminController.getStats);

app.get("/api/admin/hello", adminController.hello);
app.get("/api/admin/testdb", adminController.testDb);

// User and auth
app.post("/api/authenticate", authController.authenticate);
app.get("/api/users/me", isAuthenticated, authController.getMe);
app.get("/api/users", isUserInAdmin, authController.getUsers);

// Not supported for now
// app.post("/api/users", authController.registerUser);

// Shipping (Integration with Cargonizer)
app.post('/api/shipping/ship-business-order',  isUserInSuperuser, shippingController.CreateConsignmentForBusinessOrder);
app.post('/api/shipping/ship-gift-subscription',  isUserInSuperuser, shippingController.CreateConsignmentForGiftSubscription);

// Gift subscriptions (Integration with Woo)
app.get('/api/giftsubscriptions', isUserInSuperuser, giftSubscriptionController.getGiftSubscriptions);
app.post('/api/giftsubscriptions/import', isUserInSuperuser, giftSubscriptionController.importGiftSubscriptions);
app.put('/api/giftsubscriptions/:id/first-delivery-date', isUserInSuperuser, giftSubscriptionController.setFirstDeliveryDate);

// Customers
app.get("/api/customers", customerController.getCustomers);
app.get("/api/customers/:id", customerController.getCustomer);
app.post("/api/customers", isUserInSuperuser, customerController.createCustomer);
app.put("/api/customers/:id", isUserInSuperuser, customerController.updateCustomer);

// Products
app.get("/api/products", productController.getProducts);
app.get("/api/products/:id", productController.getProduct);
app.post("/api/products", isUserInSuperuser, productController.createProduct);
app.put("/api/products/:id", isUserInSuperuser, productController.updateProduct);

// Orders
app.get("/api/orders", isUserInSuperuser, orderController.getOrders);
app.get("/api/orders/:id", isAuthenticated, orderController.getOrders);
app.get("/api/orders/mine", isAuthenticated, orderController.getMyOrders);
app.post("/api/orders", isUserInSuperuser, orderController.createOrder);
app.post("/api/orders/:id/complete", isUserInSuperuser, orderController.completeOrder);
app.post("/api/orders/:id/cancel", isUserInSuperuser, orderController.cancelOrder);
app.post("/api/orders/:id/process", isUserInSuperuser, orderController.processOrder);
app.post("/api/orders/:id/notes", isUserInSuperuser, orderController.addOrderNote);

// Subscriptions
// app.get("/api/subscriptions/mine", isAuthenticated, subscriptionController.getSubscriptions);
// app.post("/api/subscriptions/:id/activate", isAuthenticated, subscriptionController.activateSubscription);
// app.post("/api/subscriptions/:id/pause", isAuthenticated, subscriptionController.pauseSubscription);
// app.post("/api/subscriptions/:id/cancel", isAuthenticated, subscriptionController.startCancelSubscription);
// app.get("/api/subscriptions", isUserInSuperuser, subscriptionController.getSubscriptions);
// app.get("/api/subscriptions/data/delivery-dates", isUserInSuperuser, subscriptionController.getNextStandardDeliveryDates);
// app.post("/api/subscriptions/:id/complete-cancel", isUserInSuperuser, subscriptionController.completeCancelSubscription);
// app.post("/api/subscription/engine/create-renewal-orders", isUserInSuperuser, subscriptionController.createRenewalOrders);

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
