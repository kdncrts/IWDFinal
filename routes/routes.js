const express = require('express');
const ModelUtils = new (require('../utils/ModelUtils'))();
const router = express.Router();

// These routes use the Promise Example I posted
router.route("/").get(
    function(req, res){
        var model = {
            header: ModelUtils.buildHeader("/", null /* would be a user here */),
        }
        res.render("index", model);
    }
);

router.route("/register").get(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader("register", null)
        }
        res.render("register", model);
    }
)

router.route("/login").get(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader("login", null)
        }
        res.render("login", model);
    }
)

module.exports = router;