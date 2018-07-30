const express = require('express');
const app = express();
const PORT = process.env.PORT || 5002;

// const forceSSL = function() {
//     return function (req, res, next) {
//         if (req.headers['x-forwarded-proto'] !== 'https') {
//             return res.redirect(['https://', req.get('Host'), req.url].join(''));
//         }
//         next();
//     }
// }
  
// app.use(forceSSL());

app.use(express.static(__dirname + '/dist/mb-shop'));

app.get('/hello', (req, res) => res.send('Hello Node and Heroku, Maridalen Brenneri is coming up!'))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))