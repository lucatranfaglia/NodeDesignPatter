import cors from 'cors';
import auth from './middleware/auth'
import express from 'express';
const app = express();


// ------------------------------------
// LOGGER
// ------------------------------------
import logger from 'morgan';


// ------------------------------------
// CORS
// ------------------------------------
const corsOptions ={
   origin:'*',                  // origin: 'http://example.com',
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions)) // Use this after the variable declaration

// ------------------------------------
// HTTP request logger middleware for node.js
// ------------------------------------
app.use(logger('dev'));

// ------------------------------------
// FORMAT 
// ------------------------------------
// POSTMAN POST x-www-form-urlencoded (chiave-valore) : per la lettura del dato nel req.body è necessario convertire il contenuto in JSON 
// true: vengono mappati a json anche i paramentri a null e undefined
// false: vengono mappati a json solo stringhe
app.use(express.urlencoded({extended: true}));

// POSTMAN POST raw: per la lettura del dato nel req.body è necessario convertire il contenuto in JSON 
app.use(express.json());


// ------------------------------------------------------
// ROUTES
// ------------------------------------------------------
import {routes } from "./routes/oauthRoutes.js";

// ------------------------------------------------------
// ROUTES
// ------------------------------------------------------
app.use('/api', routes());


export default app;