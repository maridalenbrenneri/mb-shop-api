import * as express from "express";
import * as bodyParser from "body-parser";

const app = express();

app.set("port", process.env.PORT || 5002);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Controllers (route handlers)
import * as productController from "./controllers/product";

// Main routes
app.get("/api/products", productController.getAllProducts);

export default app;
