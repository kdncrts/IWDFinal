const express = require('express');
const ModelUtils = new (require('../utils/ModelUtils'))();
const router = express.Router();
const bcrypt = require('bcrypt');

// These routes use the Promise Example I posted
router.route("/").get(
    function(req, res) {
        ModelUtils.read("users", {}, userList => {
            const toppings = {
                "Pepperoni": 0, 
                "Mushroom": 0, 
                "Anchovies": 0, 
                "Sausage": 0, 
                "Artichokes": 0, 
                "Pineapple": 0
            }
            const colors = {
                "Red": 0, 
                "Orange": 0, 
                "Yellow": 0, 
                "Green": 0, 
                "Blue": 0,
                "Purple": 0,
                "Pink": 0,
                "Black": 0,
                "White": 0
            }
            const random = {};
            if(userList) {
                userList.forEach(user => {
                    toppings[user.toppings]++;
                    colors[user.colors]++;
                    random[user.number] = random[user.number] ? random[user.number] + 1 : 1;
                })
            }
            const model = {
                header: ModelUtils.buildHeader(req),
                toppings,
                colors,
                random
            }
            res.render("index", model);
        });
    }
);

router.route("/register").get(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader(req)
        }
        res.render("register", model);
    }
)

router.route("/profile").get(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader(req)
        }
        if(req.session.user) {
            ModelUtils.read("users", {email: req.session.user.email}, data => {
                if(data && data.length) {
                    model["user"] = data[0]; 
                    res.render("profile", model);
                }
                else {
                    res.redirect('/logout');
                }
            });
        } else {
            res.redirect('/logout');
        }
    }
)

router.route("/update").get(
    function(req, res) {
        res.redirect("/profile");
    }
);

router.route("/update").post(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader(req)
        }
        if (!req.session.user){
            res.redirect('/logout');
            return;
        } else {
            ModelUtils.read("users", {email: req.session.user.email}, data => {
                if(data) {
                    var newPassword = "";
                    if(req.body.password) {
                        newPassword = bcrypt.hashSync(req.body.password, 10);
                    }
                    else {
                        newPassword = data[0].password;
                    }
                    var updateUser = {
                        username: req.body.username ? req.body.username : data[0].username,
                        password: newPassword,
                        email: req.body.email ? req.body.email : data[0].email,
                        role: data[0].role,
                        status: "active",
                        age: req.body.age ? req.body.age : data[0].age,
                        toppings: req.body.toppings ? req.body.toppings : data[0].toppings,
                        colors: req.body.toppings ? req.body.colors : data[0].colors,
                        number: req.body.number ? req.body.number : data[0].number
                    }
                    ModelUtils.update("users", {email: req.body.email}, updateUser, () => {
                        req.session.user.email = updateUser.email;
                        req.session.user.username = updateUser.username;
                        res.redirect("/profile");
                    })
                } 
                else {
                    model["error"] = "An error occured while updating your account";
                    res.render("profile", model);
                }
            });
        }
    }
)

router.route("/register").post(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader(req)
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
        if(!req.body.age) {
            errorHappened = true;
            errorMessage = "Age is required";
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
                if(user && user.length){
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
                        "toppings": req.body.topping,
                        "colors": req.body.color,
                        "number": req.body.random
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
                        model["header"] = ModelUtils.buildHeader(req);
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
            header: ModelUtils.buildHeader(req)
        }
        res.render("login", model);
    }
)

router.route("/logout").get(
    function(req, res) {
        req.session.user = undefined;
        res.redirect("/");
    }
)

router.route("/login").post(
    function(req, res) {
        const model = {
            header: ModelUtils.buildHeader(req)
        }
        const {email, password} = req.body;
        ModelUtils.read("users", {email: email}, data => {
            if(data && data.length) {
                const user = data[0];
                if(user.status == "suspended") {
                    model["error"] = "ACCOUNT WITH THAT EMAIL HAS BEEN SUSPENDED";
                    res.render("login", model);
                }
                else if(bcrypt.compareSync(password, user.password)) {
                    var loginUser = {
                        username: data[0].username,
                        email: data[0].email,
                        role: data[0].role
                    }
                    req.session.user = loginUser;
                    res.redirect("/");
                } else {
                    model["error"] = "Password was not correct";
                    res.render("login", model);
                }
                // check password against saved hash
                // if true log the user in and log session
                // else tell them that that was the wrong password for that user
            } else {
                model["error"] = "User could not be found with that email.";
                res.render("login", model);
            }
        })
    }
)

module.exports = router;