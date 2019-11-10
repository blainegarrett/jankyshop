// Jankyshop backend for auth, etc
const express = require('express');
const next = require('next');
const compression = require('compression');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

// GAE passes the port the app will run on via process.env.PORT
const port = process.env.PORT ? process.env.PORT : 3000;

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(compression());

    // Robots.txt
    server.get('/robots.txt', function(req, res) {
      res.type('text/plain');
      res.send('User-agent: *\nDisallow: /admin/\nDisallow: /api/');
    });

    // Favicon
    server.get('/favicon.ico', (req, res) =>
      res.status(200).sendFile('favicon.ico', { root: __dirname + '/static/' })
    );

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(
        `> Ready on http://localhost:${port} NODE_ENV: ${process.env.NODE_ENV}`
      );
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
