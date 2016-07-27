var express = require('express');
var fs = require('fs');
var https = require('https');
var cors = require('cors');
var app = express();


var options = {
            key: fs.readFileSync('ssl/localhost.key.pem'),
            cert: fs.readFileSync('ssl/localhost.cert.pem'),
            ca: [fs.readFileSync('ssl/intermediate.cert.pem'), fs.readFileSync('ssl/root.cert.pem')],
            requestCert: true,
            rejectUnauthorized: false,
            passphrase: 'secretpassword'
        }

app.use(cors());
app.set('host', process.argv[2] || 'localhost');
app.set('port', process.argv[3] || 8080);

var listener = https.createServer(options, app);

        app.get('/', function (req, res) {
            req.client.authorized ?
                res.status(200).json({
                    "status": "approved"
                }) :
                res.status(401).json({
                    "status": "denied"
                });
        });

listener.listen(app.get('port'), app.get('host'), function () {
    var portNum = (listener.address().port);
    var host = (listener.address().address);
  console.log('Application running on https://' + host + ":" + portNum);
});