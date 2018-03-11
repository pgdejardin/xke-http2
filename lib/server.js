const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const http2 = require('http2');
const http = require('http');

const app = new Koa();

app.use(serve(path.resolve(process.cwd(), 'public')));

const options = {
  key: fs.readFileSync('./cert/localhost.key'),
  cert: fs.readFileSync('./cert/localhost.crt'),
};

http.createServer(app.callback()).listen(3000, () => { // Or app.listen(3000, ...)
  console.log('HTTP/1.1 Server started on 3000');
});

http2.createSecureServer(options, app.callback()).listen(3443, () => {
  console.log('HTTP/2 Server started on 3443');
});
