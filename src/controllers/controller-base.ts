import { Response, Request } from "express";
import logger from '../utils/logger';

class ControllerBase {

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
  
    protected handleError(res: Response, err: any, message: string) : void {
      logger.error(err);
      res.status(500).send({error: message});
    }
  }

  export default ControllerBase;