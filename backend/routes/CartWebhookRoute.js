 // routes/CartWebhookRoute.js
 import express from 'express';
 import { cartWebhookHandler } from '../controllers/CartWebhookController.js';

 const router = express.Router();

 // Define the handler for the ROOT of this router (e.g. / )
 // The middleware (express.raw) will be applied in server.js when this is mounted.
 router.post('/', cartWebhookHandler);

 export default router;