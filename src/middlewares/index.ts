import express from 'express';
import {get, merge} from 'lodash';
import { getUserBySessionToken } from '../db/users';


export const isAuthenticated = async(req: express.Request, res: express.Response, next:express.NextFunction) => {
    try{
        //checking for the session token
        const sessionToken = req.cookies['ARIJIT-AUTH'];
        if(!sessionToken){
            return res.sendStatus(400);
        }
        else{
            //checking if any user exist with that token
            const existingUser = await getUserBySessionToken(sessionToken);
            if(!existingUser){
                return res.sendStatus(403);
            }
            else{
                merge(req, {identity: existingUser})
                return next();
            }
        }
    }
    catch(error){
        console.log(error)
        return res.sendStatus(400)
    }
}
