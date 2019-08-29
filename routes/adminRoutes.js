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
        } else {
            const model = {
                header: ModelUtils.buildHeader(req)
            };
            res.redirect("/")
        }
    }
);

router.route("/user/activate/:email").get(
    function(req, res){
        const model = {
            header: ModelUtils.buildHeader(req),
        };
        if(req.session.user && req.session.user.role == 'admin') {
            ModelUtils.read("users", {email: req.params.email}, data => {
                console.log(data);
                if(data && data.length) {
                    const user = data[0];
                    user["status"] = "active";
                    ModelUtils.update("users", {email: req.params.email}, user, () => {
                        ModelUtils.read("users", {}, data => {
                            model["users"] = data;
                            res.redirect("/admin/users");
                        });
                    });
                } 
                else {
                    res.redirect("/admin/users");
                }
            });
        } else {
            res.redirect("/logout");
        }
    }
);

router.route("/user/suspend/:email").get(
    function(req, res){
        const model = {
            header: ModelUtils.buildHeader(req),
        };
        if(req.session.user && req.session.user.role == 'admin') {
            ModelUtils.read("users", {email: req.params.email}, data => {
                console.log(data);
                if(data && data.length) {
                    const user = data[0];
                    user["status"] = "suspended";
                    ModelUtils.update("users", {email: req.params.email}, user, () => {
                        ModelUtils.read("users", {}, data => {
                            model["users"] = data;
                            res.redirect("/admin/users");
                        });
                    });
                } 
                else {
                    res.redirect("/admin/users");
                }
            });
        } else {
            res.redirect("/logout");
        }
    }
);

module.exports = router;