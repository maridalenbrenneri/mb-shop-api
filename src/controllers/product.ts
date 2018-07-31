
// import async from "async";
// import request from "request";
import { Response, Request, NextFunction } from "express";
import logger from "../utils/logger";
import * as dbclient  from "../repositories/db-client"

/**
 * GET /products/:id
 */
export let getProduct = (req: Request, res: Response) => {
  var productId = req.params.id;
  var provider = req.get('X-Header-Provider');

  res.send("Hello from products route " + productId);
};

/**
 * GET /products
 * Get all products
 */
export let getAllProducts = (req: Request, res: Response) => {
    var productId = req.params.id;
    var provider = req.get('X-Header-Provider');

    dbclient.getStuff();

    logger.info("all products was requested");

    res.send("All products");
};