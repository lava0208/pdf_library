const express = require('express');
const next = require('next');
const fs = require('fs');
const https = require('https');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync("./cert/privkey3.pem"),
  cert: fs.readFileSync("./cert/fullchain3.pem"),
};

app.prepare()
  .then(() => {
    const server = express();

    server.get('*', (req, res) => {
      return handle(req, res)
    });

    server.use ((req, res, next) => {
      if (req.secure) {
          // request was via https, so do no special handling
          next();
      } else {
          // request was via http, so redirect to https
          res.redirect('https://' + req.headers.host + req.url);
      }
    });

    https.createServer(options, server).listen(443, process.env.HOST, () => { });
    //https.createServer(options, server).listen(443, "127.0.0.1", () => {
    //  console.log(`Server running at https://127.0.0.1/`);
    //});
    //https.createServer(options, server).listen(443, "94.72.120.252", () => {
    //  console.log(`Server running at https://94.72.120.252/`);
    //});



  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});