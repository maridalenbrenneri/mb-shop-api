import { Response, Request } from 'express';
import logger from '../utils/logger';
import arrayUtils from '../utils/array-utils'
import fikenService from '../services/fiken-service';

class CustomerController {

    /**
     * GET /customers
     */
    getCustomers = function (req: Request, res: Response) {

        fikenService.getCustomers().then(customers => {

            arrayUtils.sortByName(customers);
            res.send(customers);

        }).catch(function (err) {
            logger.error(err);
            res.status(500).send({ error: "An error occured when getting the customers: " + err });
        });
    }
}

export default new CustomerController();