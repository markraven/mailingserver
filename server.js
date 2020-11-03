const http = require('http');
const app= require('./app');
const bodyParser = require('body-parser');  
const port = process.env.PORT || 3000;
var express = require('express');
var cors = require('cors');


app.use(cors());
const server = http.createServer(app);


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


server.listen(port);
