const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const http2 = require('http2');
const helper = require('./helper');

const app = new Koa();
const { HTTP2_HEADER_PATH } = http2.constants;
const PUBLIC_PATH = path.resolve(process.cwd(), 'public');
const publicFiles = helper.getFiles(PUBLIC_PATH);


const options = {
  key: fs.readFileSync('./cert/localhost.key'),
  cert: fs.readFileSync('./cert/localhost.crt'),
};

// Push file
function push(stream, path) {
  const file = publicFiles.get(path);

  if (!file) {
    return;
  }

  stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (pushStream) => {
    pushStream.respondWithFD(file.fileDescriptor, file.headers);
  });
}

// Serve files
app.use(async (ctx) => {
  const { request, req, res } = ctx;
  const reqPath = request.path === '/' ? '/index.html' : request.path;
  const file = publicFiles.get(reqPath);

  // File not found
  if (!file) {
    ctx.throw(404);
  }

  // Push with index.html
  if (reqPath === '/index.html') {
    push(req.stream, '/main.js');
    push(req.stream, '/main.css');
  }

  // Serve file
  res.stream.respondWithFD(file.fileDescriptor, file.headers);
});

http2.createSecureServer(options, app.callback()).listen(3443, () => {
  console.log('HTTP/2 Server started on 3443');
});
