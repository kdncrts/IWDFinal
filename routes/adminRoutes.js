const express = require('express');
const ModelUtils = new (require('../utils/ModelUtils'))();

// Mongo variables
var router = express.Router();

// These routes use the Promise Example I posted
router.route("/users").get(
    function(req, res){
        if(req.session.user != undefined && req.session.user.role == "admin") {
            const model = {
                header: ModelUtils.buildHeader("/admin/users", req.session.user),
            };
            ModelUtils.read("users", {}, data => {
                model["users"] = data;
                res.render("admin", model);
            });
        }
        else {
            const model = {
                header: ModelUtils.buildHeader("/", req.session.user)
            };
            res.render("index", model)
        }
    }
);

router.route("/user/activate/:email").get(
    function(req, res){
        if(req.session.user != undefined && req.session.user.role == 'admin') {
            console.log(req.params.email);
            ModelUtils.update("users", {email: req.params.email}, {status: "activate"});
            const model = {
                header: ModelUtils.buildHeader("/admin/users", req.session.user),
            };
            ModelUtils.read("users", {}, data => {
                model["users"] = data;
                res.render("admin", model);
            });
        }
    }
);

router.route("/user/suspend/:email").get(
    function(req, res){
        if(req.session.user != undefined && req.session.user.role == 'admin') {
            console.log(req.params.email);
            ModelUtils.update("users", {email: req.params.email}, {status: "suspended"});
            const model = {
                header: ModelUtils.buildHeader("/admin/users", req.session.user),
            };
            ModelUtils.read("users", {}, data => {
                model["users"] = data;
                res.render("admin", model);
            });
        }
    }
);

module.exports = router;