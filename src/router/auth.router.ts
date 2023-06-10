import express from 'express';
import {registerUser, loginUser} from '../controllers/auth.controller';

export default (router: express.Router) => {
    router.post('/auth/register', registerUser);
    router.post('/auth/login', loginUser);
}