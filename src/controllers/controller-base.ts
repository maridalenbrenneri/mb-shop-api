import { Response, Request } from "express";
import logger from "utils/logger";

abstract class ControllerBase {

    protected verifyApiKey(req: Request) {
      var provider = req.get('X-Header-Provider');
  
      return true;
    }
  
    protected isUserInCustomerOrAbove(req: Request) {
      return true;
    }
  
    protected isUserInStoreManagerOrAbove(req: Request) {
      return true;
    }
  
    protected isUserInAdmin(req: Request) {
      return true;
    }
  
    protected handleError(res: Response, err: any, message: string) {
      logger.error(err);
      res.status(500).send({error: message});
    }
  }

  export default ControllerBase;