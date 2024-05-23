const express = require('express');
const next = require('next');
const fs = require('fs');
const https = require('https');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync("./cert/privkey1.pem"),
  cert: fs.readFileSync("./cert/fullchain1.pem"),
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

    server.listen(5000, () => {
      console.log('Server is running on port 5000');
    });

    // https.createServer(options, server).listen(443, "154.38.178.246", () => {
    //   console.log(`Server running at https://154.38.178.246/`);
    // });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});