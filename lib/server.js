const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

const app = new Koa();

app.use(serve(path.resolve(process.cwd(), 'public')));

const options = {
  key: fs.readFileSync('./cert/localhost.key'),
  cert: fs.readFileSync('./cert/localhost.crt'),
};

http.createServer(app.callback()).listen(3000, () => {
  console.log('HTTPS Server started on 3000');
});

https.createServer(options, app.callback()).listen(3443, () => {
  console.log('HTTPS Server started on 3443');
});
