const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

const app = express();

app.use(express.static(path.resolve(process.cwd(), 'public')));

const options = {
  key: fs.readFileSync('./cert/localhost.key'),
  cert: fs.readFileSync('./cert/localhost.crt'),
};

http.createServer(app).listen(3000, () => {
  console.log('HTTPS Server started on 3000');
});

https.createServer(options, app).listen(3443, () => {
  console.log('HTTPS Server started on 3443');
});
