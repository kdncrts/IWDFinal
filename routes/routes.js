const express = require('express');
const ModelUtils = new (require('../utils/ModelUtils'))();
const router = express.Router();
const bcrypt = require('bcrypt');

// These routes use the Promise Example I posted
router.route("/").get(
    function(req, res){
        var model = {
            header: ModelUtils.buildHeader("/", req.session.role /* would be a user here */),
        }
        res.render("index", model);
    }
);

router.route("/register").get(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader("/register", req.session.role)
        }
        res.render("register", model);
    }
)

router.route("/register").post(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader("/register", req.session.user)
        }
        // validate form data ? 
        filter = {
            email: req.body.email
        }
        var errorHappened = false;
        var hashedPassword = "";
        var errorMessage = "";
        if(req.body.password && req.body.password == req.body.confirmPassword) {
            hashedPassword = bcrypt.hashSync(req.body.password, 10);
        } 
        else {
            errorHappened = true;
            errorMessage = "Password is not valid";
            if(req.body.password != req.body.confirmPassword) {
                errorMessage = "Passwords do not match";
            }
        }
        
        if(!req.body.username) {
            errorHappened = true;
            errorMessage = "No username";
        }
        if(!req.body.email) {
            errorHappened = true;
            errorMessage = "Email is required";
        }
        if(errorHappened) {
            model["error"] = errorMessage;
            res.render("register", model);
            return;
        } else {
            // check for existing email/user
            ModelUtils.read("users", filter, user => {
                // if user already exits
                if(user){
                    model["error"] = "User already associcated with that email"
                    res.render("register", model);
                    return;
                } else {
                    var newUser = {
                        "username": req.body.username,
                        "password": hashedPassword,
                        "email": req.body.email,
                        "role": "user",
                        "status": "active",
                        "age": req.body.age,
                        "q1": req.body.topping,
                        "q2": req.body.color,
                        "q3": req.body.random
                    }
                    // if existing user doesn't exist, then add the new users
                    // format body and salt password
                    ModelUtils.create("users", newUser, response => {
    
                        // save user to session
                        var user = {
                            username: newUser.username,
                            email: newUser.email,
                            role: newUser.role
                        }
                        req.session.user = user;
                        model["header"] = ModelUtils.buildHeader("/", user);
                        res.render("index", model);
                        return;
                    });
                }
            });
        }
    }
)

router.route("/login").get(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader("/login", req.session.user)
        }
        res.render("login", model);
    }
)

router.route("/logout").get(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader("/", req.session.user)
        }
        var user = {
            username: "",
            email: "",
            role: ""
        }
        req.session.user = user;
        res.render("index", model);
    }
)

router.route("/login").post(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader("/login", req.session.user)
        }
        const {email, password} = req.body;
        ModelUtils.read("users", {email: email}, data => {
            if(data[0]) {
                if(bcrypt.compareSync(password, data[0].password)) {
                    var user = {
                        username: data[0].username,
                        email: data[0].email,
                        role: data[0].role
                    }
                    req.session.user = user;
                    console.log("login session user: " + req.session.user);
                    console.log("session: " + req.session);
                    model["header"] = ModelUtils.buildHeader("/", req.session.user);
                    res.render("index", model);
                } else {
                    model["error"] = "Password was not correct";
                    res.render("login", model);
                }
                // check password against saved hash
                // if true log the user in and log session
                // else tell them that that was the wrong password for that user
            } else {
                model["error"] = "User could not be found with that email";
                res.render("login", model);
            }
        })
    }
)

module.exports = router;