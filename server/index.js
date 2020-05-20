const express = require('express');
const app = express();
const settings = require('./settings.json');
const port = settings.port;
const Ratelimit = require('./util/ratelimit.js');
// Routes
const centres = require('./routes/centres');
app.use(express.json());


app.get('/', function (req, res) {
    res.send({
        message: "Polaris promotion system root",
        status: 200
    });
});

app.use(Ratelimit);

// Routes
app.use('/centres', centres);
app.listen(port);
console.log(`Running on port ${port}`);

// Error catch
app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).send({error: {status: 400, message: "Invalid json"}});
    } else {
        console.error('Error caught: ', error.stack);
        res.status(500).send({error: {status: 500, message: error.message}});
    }
});


app.use(function (req, res, next) {
    return res.status(404).send({error: {status: 404, message: "Page not found."}});
});

process.on('uncaughtException', function(err) {
    console.log( " UNCAUGHT EXCEPTION " );
    console.log( "[Inside 'uncaughtException' event] " + err.stack || err.message );
});
process.on('unhandledRejection', function(err) {
    console.log( " UNCAUGHT REJECTION " );
    console.log( "[Inside 'uncaughtRejection' event] " + err.stack || err.message || err );
});
