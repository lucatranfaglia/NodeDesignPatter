#!/usr/bin/env node

import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Module dependencies.
 */
import app from '../app.js';
import debug from 'debug';
import http from 'http'


// eslint-disable-next-line no-undef
let processEnv = process.env.PORT ? process.env.PORT : '80';
let port;
/**
 * Get port from environment and store in Express.
 */
const PORT = normalizePort(processEnv);
app.set('port', PORT);


/**
 * Create HTTP server.
 */
let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(PORT, async()=>{    
    console.log(`Server in ascolto all'indirizzo: ${PORT}`);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw new Error(error);
    }

    const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : 'Port ' + PORT;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            // eslint-disable-next-line no-undef
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            // eslint-disable-next-line no-undef
            process.exit(1);
            break;
        default:
            throw new Error(error);
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    debug('Listening on ' + bind);
}
