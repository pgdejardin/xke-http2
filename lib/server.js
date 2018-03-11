const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(process.cwd(), 'public')));

app.listen(3000, () => {
  console.log('server started on port 3000')
});
