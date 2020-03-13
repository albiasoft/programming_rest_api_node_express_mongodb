var Config = require("../../config.js");
var UserManager = require("./UserManager.js")

module.exports = class APIServer {
  constructor(port) {
    var bodyParser = require("body-parser");
    this._express = require("express")().use(bodyParser.json()).use(function(req, res, next){
      var allowedOrigins = Config.allowedOrigins;
      var origin = req.header.origin;
      if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }

      res.header("Access-Control-Allow-Credentials", true);
      res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
      res.header("Access-Control-Allow-Header", "Origin, Content-Type, Accept");
      res.header("Content-Type", "application/json;charset=utf-8");
      next();
    });
    this._port = port;
    this._server = require("http").createServer(this._express);
    this.initEndpoints();
  }

  startServer() {
    this.stopServer();
    var self = this;
    this._server.listen(this._port, function() {
      console.log("Server listening at port %d", self._port);
    });
  }

  stopServer() {
    this._server.close(function() {
      console.log("Server stoped.");
    });
  }

  initEndpoints() {
    /* POST /users */
    this._express.post("/users", function(req, res) {
      console.log("POST /users");

      UserManager.createUser(req.body, function(user, success) {
        if (success) {
          res.writeHead(200);
          res.end(JSON.stringify(user));
        } else {
          res.writeHead(500);
          res.end();
        }
      });

    }).bind(this);

    /* GET /users/:id */
    this._express.get("/users/:id", function(req, res) {
      console.log("GET /users/"+req.params.id);

      UserManager.getUserWithId(Number(req.params.id), function(user, success) {
        if(success) {
          res.writeHead(200);
          res.end(JSON.stringify(user));
        } else {
          res.writeHead(500);
          res.end();
        }
      });

    }).bind(this);

    /* DELETE /users/:id */
    this._express.delete("/users/:id", function(req, res) {
      console.log("DELETE /users/"+req.params.id);

      UserManager.deleteUserWithId(Number(req.params.id), function(success) {
        if(success) {
          res.writeHead(200);
          res.end(JSON.stringify({}));
        } else {
          res.writeHead(500);
          res.end();
        }
      });

    }).bind(this);

    /* PUT /users/:id */
    this._express.put("/users/:id", function(req, res) {
      console.log("PUT /users/"+req.params.id);

      UserManager.updateUserWithId(Number(req.params.id), req.body, function(success) {
        if(success) {
          res.writeHead(200);
          res.end(JSON.stringify({}));
        } else {
          res.writeHead(500);
          res.end();
        }
      });

    }).bind(this);

    /* GET /users */
    this._express.get("/users", function(req, res) {
      console.log("GET /users");

      UserManager.getUsers(function(users, success) {
        if(success) {
          res.writeHead(200);
          res.end(JSON.stringify(users));
        } else {
          res.writeHead(500);
          res.end();
        }
      });
    }).bind(this);

  }
}
