var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.use(function (req, res, next) {
  console.log('[middleware]');
  req.testing = 'testing';
  return next();
});

app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    const [name, index] = msg.split('-')
    // ws.send(`${name}-${Number(index)++ || 0}`);
    ws.send('1111111');
  });
  console.log('socket', req.testing);
});

app.listen(3000);