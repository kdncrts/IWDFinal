const express = require('express');
const ModelUtils = new (require('../utils/ModelUtils'))();

// Mongo variables
var router = express.Router();

// These routes use the Promise Example I posted
router.route("/users").get(
    function(req, res){
        if(req.session.user != undefined && req.session.user.role == "admin") {
            const model = {
                header: ModelUtils.buildHeader(req),
            };
            ModelUtils.read("users", {}, data => {
                model["users"] = data;
                res.render("admin", model);
            });
        }
        else {
            const model = {
                header: ModelUtils.buildHeader(req)
            };
            res.render("index", model)
        }
    }
);

router.route("/user/activate/:email").get(
    function(req, res){
        const model = {
            header: ModelUtils.buildHeader(req),
        };
        if(req.session.user != undefined && req.session.user.role == 'admin') {
            ModelUtils.read("users", {email: req.params.email}, data => {
                if(data && data.lenth) {
                    data[0]["status"] = "active";
                    ModelUtils.update("users", {email: req.params.email}, data[0], callback =>{
                        ModelUtils.read("users", {}, data => {
                            model["users"] = data;
                            res.render("admin", model);
                        });
                    });
                } 
                else {
                    model["error"] = "Something went wrong couldn't find specified user";
                    res.render("admin", model);
                }
            });
        }
    }
);

router.route("/user/suspend/:email").get(
    function(req, res){
        const model = {
            header: ModelUtils.buildHeader(req),
        };
        if(req.session.user != undefined && req.session.user.role == 'admin') {
            ModelUtils.read("users", {email: req.params.email}, data => {
                if(data && data.lenth) {
                    data[0]["status"] = "suspended";
                    ModelUtils.update("users", {email: req.params.email}, data[0], callback =>{
                        ModelUtils.read("users", {}, data => {
                            model["users"] = data;
                            res.render("admin", model);
                        });
                    });
                } 
                else {
                    model["error"] = "Something went wrong couldn't find specified user";
                    res.render("admin", model);
                }
            });
        }
    }
);

module.exports = router;