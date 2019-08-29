const express = require('express');
const ModelUtils = new (require('../utils/ModelUtils'))();

// Mongo variables
var router = express.Router();

// These routes use the Promise Example I posted
router.route("/users").get(
    function(req, res){
        ModelUtils.read("users", {}, data => {
            const model = {
                header: ModelUtils.buildHeader("/admin/users", null),
                users: data
            };
            res.render("admin", model);
        });
    }
);

router.route("/user/activate/:email").get(
    function(req, res){
        console.log(req.params.email);
    }
);

router.route("/user/suspend/:email").get(
    function(req, res){
        req.query.email
    }
);

module.exports = router;