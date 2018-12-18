import { Response, Request } from "express";
import logger from '../utils/logger';
import { ValidationError } from "../models/validation-error";

export class ControllerHelper {

    protected verifyApiKey = function (req: Request) : Boolean {
      var provider = req.get('X-Header-Provider');
  
      return true;
    }
  
    protected isUserInCustomerOrAbove(req: Request) : Boolean {
      return true;
    }
  
    protected isUserInStoreManagerOrAbove(req: Request) : Boolean {
      return true;
    }
  
    protected isUserInAdmin(req: Request) : Boolean {
      return true;
    }
  
    static handleError(res: Response, err: Error, message: string) : void {

        if (err instanceof ValidationError) {
            return res.status(422).send({validationError: err.message});
        } 

        logger.error(err);
        return res.status(500).send({ error: message + ": " + err });
    }
  }