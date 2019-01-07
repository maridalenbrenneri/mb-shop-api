import { Response, Request } from 'express';
import customerRepo from '../repositories/customer-repo';
import logger from '../utils/logger';
import arrayUtils from '../utils/array-utils'
import customerService from '../services/customer-service';
class CustomerController {

    /** 
     * GET /customers/:id
     */
    getCustomer = function (req: Request, res: Response, next: any) {

        customerRepo.getCustomer(req.params.id).then(customer => {
            if (!customer) {
                res.status(404).send("Customer was not found.");
                return;
            }

            res.send(customer);

        }).catch(function (err) {
            logger.error(err);
            res.status(500).send({ error: "An error occured when getting the customer" });
        });
    }

    /**
     * GET /customers
     */
    getCustomers = function (req: Request, res: Response) {

        // let filter = { isActive: true };

        customerService.getCustomers().then(customers => {

            arrayUtils.sortByName(customers);
            res.send(customers);

        }).catch(function (err) {
            logger.error(err);
            res.status(500).send({ error: "An error occured when getting the customers: " + err });
        });
    }

    /**
     * POST /customers
     */
    createCustomer = function (req: Request, res: Response) {

        // todo: validate body content...

        customerRepo.createCustomer(req.body).then(customer => {
            res.send(customer);

        }).catch(function (err) {
            logger.error(err);
            res.status(500).send({ error: "An error occured when creating the customer: " + err });
        });
    }

    /**
     * PUT /customers/:id
     */
    updateCustomer = function (req: Request, res: Response) {

        // todo: validate body content...

        customerRepo.updateCustomer(req.params.id, req.body).then(updatedCustomer => {

            res.send(updatedCustomer)

        }).catch(function (err) {
            logger.error(err);
            res.status(500).send({ error: "An error occured when updating the customer: " + err });
        });
    }
}

export default new CustomerController();