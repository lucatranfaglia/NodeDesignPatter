import express from 'express';
const router = express.Router();
import { debug } from 'console';
import { oauthController } from "../controllers/oauthController.js";

export function routes() {
    
    /**
        Get jgv spec_v3
     */
    router.get('/oauth/v1', oauthController);

    return router;
}

export default routes;