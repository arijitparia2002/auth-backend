import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { random, authenticate } from '../helpers';

//login user
export const loginUser = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.sendStatus(400);
        } 

        //if user exist 
        const user = await getUserByEmail(email).select('+authentication.password +authentication.salt');
        if (!user) {
            return res.sendStatus(400);
        }
        //genarate hash to check the right password
        const hash = authenticate(password, user.authentication.salt);
        if (hash !== user.authentication.password) {
            return res.sendStatus(403);
        }
        else{
            const salt = random();
            user.authentication.sessionToken = authenticate(user._id.toString(), salt);

            await user.save();

            res.cookie('ARIJIT-AUTH', user.authentication.sessionToken,{domain: 'localhost', path: '/'});
            return res.status(200).json(user).end();
        }

    }
    catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}


//register user
export const registerUser = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;
        if(!email || !password || !username) {
            return res.sendStatus(400);
        }

        //if the user already exist
        const existingUser = await getUserByEmail(email);
        if(existingUser) {
            return res.sendStatus(409);
        }

        //if none of that -- create user
        const salt = random();
        const newUser = await createUser({
            username,
            email,
            authentication: {
                password: authenticate(password, salt),
                salt,
            }
        })
        return res.status(200).json(newUser);

    }
    catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}