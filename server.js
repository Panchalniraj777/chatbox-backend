// PARSE .ENV
require('dotenv').config();

const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 8000;
const app = express();
require('./Configs/globals');

const server = http.createServer(app);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ------------------------    RESPONSE HANDLER    -------------------
app.use((req, res, next) => {
    const ResponseHandler = require('./Configs/responseHandler');
    res.handler = new ResponseHandler(req, res);
    next();
});

// --------------------------    ROUTES    ------------------
const appRoutes = require('./Routes');
appRoutes(app);

// ------------------------    SOCKET HANDLER    -------------------
const socketHandler = require('./Configs/socketHandler'); 
socketHandler.initializeSocket(server);

// --------------------------    START SERVER    ---------------------
server.listen(port, () => {
    console.log(
        chalk.greenBright(
            `\nServer started on port ${chalk.white.bold(port)} ${chalk.yellow.bold(':)')} \n`
        )
    );
});
