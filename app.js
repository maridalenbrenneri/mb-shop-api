/*
 * Start api with command: 'npm run start:dev'
 */

const express = require('express');

const logger = require('./logger');

const PORT = process.env.PORT || 5002;

const app = express();

var products = require('./routes/products');

app.use('/api/products/', products);

// const forceSSL = function() {
//     return function (req, res, next) {
//         if (req.headers['x-forwarded-proto'] !== 'https') {
//             return res.redirect(['https://', req.get('Host'), req.url].join(''));
//         }
//         next();
//     }
// }
  
// app.use(forceSSL());

app.get('/api/hello', (req, res) =>  {
    res.send('Hello there, Maridalen Brenneri is coming up!');
});

app.listen(PORT, () => {
  logger.info(`API started, listening on ${ PORT }`);  
});


