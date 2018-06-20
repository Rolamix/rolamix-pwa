const stencil = require('@stencil/core/server');
const express = require('express');
const compression = require('compression');
const i18nextHandler = require('./src/i18n/config.server');

// set which port express it will be using
const port = process.env.PORT || 3030;

// create the express app
const app = express();

app.use(compression());
app.use(i18nextHandler());

// load the stencil config & init server-side rendering html pages
const stencilConfig = stencil.initApp({
  app,
  configPath: __dirname,
});

// serve all static files from www directory
app.use(express.static(stencilConfig.wwwDir));

// start the server
app.listen(port, () => stencilConfig.logger.info(` 🍁 🍁 Stencil server started at http://localhost:${ port }`));
