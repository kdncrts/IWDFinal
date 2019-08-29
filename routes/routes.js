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
            header: ModelUtils.buildHeader("/register", null)
        }
        res.render("register", model);
    }
)

router.route("/register").post(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader("/register", null)
        }
        console.log(req.body)
        // validate form data ? 


        // check for existing email/user
        ModelUtils.read("users", {email: req.body.email}, user => {
            // if user already exits
            if(user){
                model["error"] = "User already associcated with that email"
                res.render("register", model);
                return;
            } else {
                // if existing user doesn't exist, then add the new users
                // format body and salt password
                ModelUtils.create("users", req.body, response => {

                    // save user to session
                    
                });
            }
        });
    }
)

router.route("/login").get(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader("/login", null)
        }
        res.render("login", model);
    }
)

router.route("/login").post(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader("/login", null)
        }
        const {username, password} = req.body;
        var user = ModelUtils.read("users", {username: username}, data => {
            if(data) {
                // check password against saved hash
                // if true log the user in and log session
                // else tell them that that was the wrong password for that user
            } else {
                model["error"] = "User could not be found with that username";
                res.render("login", model);
            }
        })
    }
)

module.exports = router;