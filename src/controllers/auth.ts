import { Response, Request } from "express";
import Sequelize from 'sequelize';
import * as jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import ControllerBase from './controller-base';
import UserRepo from "../repositories/user-repo";

class AuthController extends ControllerBase {

    authenticate = function (req: Request, res: Response) {

        UserRepo.getUserByEmail(req.body.email).then(user => {
            if(!user) {
                return res.status(401).send(`[DEBUG] User ${req.body.email} was not found`); // todo: remove error msg
            }

            if(req.body.password == user.password) { // todo: bcrypt...

                let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });

                return res.send({
                    token: token,
                    givenName: user.givenName,
                    email: user.email
                });
            }

            return res.status(401).send();

        }).catch(function (err) {
            logger.error(err);
            return res.status(500).send({error: "An error occured when authenticating the user"});
        });
    }

    getMe = function (req: Request, res: Response) {

        let token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).send('No token provided.');
        }

        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(500).send('Failed to authenticate token.');
            }

            UserRepo.getUser(decoded.id).then(user => {
                if(!user) {
                    return res.status(404).send(`User ${req.body.email} was not found`);
                }
    
                return res.send(user);
        
            }).catch(function (err) {
                logger.error(err);
                return res.status(500).send({error: "An error occured when getting the users"});
            });
        });
    }

    registerUser = function (req: Request, res: Response) {

        // todo: check auth if role != customer

        // todo: bcrypt password...

        UserRepo.createUser(req.body).then(user => {
            return res.send(user);
          
        }).catch(Sequelize.ValidationError, function (err) {
            return res.status(422).send(err.errors);

        }).catch(function (err) {
            logger.error(err);
            return res.status(500).send({error: "An error occured when registering the user"});
        });
    }

    getUsers = function (req: Request, res: Response) {

        let filter = { };
    
        UserRepo.getUsers(filter).then(users => {
            res.send(users);
    
        }).catch(function (err) {
          logger.error(err);
          res.status(500).send({error: "An error occured when getting the users"});
        });
    }
}

export default new AuthController();