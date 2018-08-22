import { Response, Request } from "express";
import Sequelize from 'sequelize';
import * as jwt from 'jsonwebtoken';
import ControllerBase from './controller-base';
import UserRepo from "../repositories/user-repo";

class AuthController extends ControllerBase {

    /**
     * 
     */
    authenticate = function (req: Request, res: Response) {

        UserRepo.getUserByEmail(req.body.email).then(user => {
            if(!user) {
                return res.status(401).send(`[DEBUG] User ${req.body.email} was not found`); // todo: remove error msg
            }

            if(req.body.password == user.password) { // todo: bcrypt...

                let userInfo = { 
                    id: user.id,
                    role: user.role
                };

                let token = jwt.sign(userInfo, process.env.JWT_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });

                return res.send({
                    token: token,
                    givenName: user.givenName,
                    email: user.email
                });
            }

            return res.status(401).send();

        });
    }

    /**
     * GET /users/me
     */
    getMe = function (req: Request, res: Response) {
        UserRepo.getUser(req.user.id).then(user => {
            if(!user) {
                return res.status(404).send(`User ${req.body.email} was not found`);
            }

            return res.send(user);
        });
    }

    /**
     * POST /api/users
     */
    registerUser = function (req: Request, res: Response) {

        // todo: check auth if role != customer

        // todo: bcrypt password...

        let user = req.body;
        user.role = 'customer';
        user.isActive = true;
        
        UserRepo.createUser(req.body).then(user => {
            return res.send(user);
          
        }).catch(Sequelize.ValidationError, function (err) {
            return res.status(422).send(err.errors);
        });
    }

    /**
     * 
     */
    getUsers = function (req: Request, res: Response) {

        let filter = { };
    
        UserRepo.getUsers(filter).then(users => {
            res.send(users);
        });
    }
}

export default new AuthController();