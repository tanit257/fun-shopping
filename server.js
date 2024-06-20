const app = require('./src/app');

const {app:{port}} = require('./src/configs/config.mongo')

// const express = require('express');
// const app = express();

const server = app.listen(port, () => {
  console.log(`App running on port ${server.address().port}`);
});


process.on('SIGNINT', () => {
    console.log('Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});