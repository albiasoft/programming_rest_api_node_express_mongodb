console.log("Users REST-API Server");
var APIServer = require("./src/api_server/APIServer.js");
var httpAPIServer = new APIServer(1992);
httpAPIServer.startServer();
