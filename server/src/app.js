require('dotenv').config({
    path: process.env.NODE_ENV == 'test' ? '.env.test' : '.env'
});
const express = require("express");

const app = express();
app.use(express.json());
app.use(require('./routes'));

module.exports = app;