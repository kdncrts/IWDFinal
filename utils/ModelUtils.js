const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');

// Mongo variables
const url = 'mongodb+srv://admin_MTM282:admin_MTM282@cluster0-mug8p.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'pug';
var mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const pages = [
    {name: "Home",          route: "/",             reqPerm: {}},
    {name: "Login",         route: "/login",        reqPerm: {noUser: true}},
    {name: "Register",      route: "/register",     reqPerm: {noUser: true}},
    {name: "Admin",         route: "/admin/users",  reqPerm: {isUser: true, perm: "admin"}},
    {name: "Logout",        route: "/logout",       reqPerm: {isUser: true}}
];


module.exports = class ModelUtils {
    buildHeader(req) {
        const user = req.session.user;
        const nav = [];
        pages.forEach(page => {
            const {isUser, noUser, perm} = page.reqPerm;
            
            if((isUser && !user) // if a user is required, but there is no user
            || (noUser && user)  // if no user is required, but there is a user
            || (perm && (!user || user.role != perm))){ // if a perm is required, but there is no user or the user doesn't have the required perm
                // they don't get the page.
            } else {
                nav.push({
                    name: page.name,
                    route: page.route,
                    selected: page.route === req.url ? "selected" : ""
                })
            }
        })
        return {
            nav,
            user
        };
    }

    read (collection, filter, callback) {
        return (async function(){
            try{
                var client = await MongoClient.connect(url, mongoOptions);
                var db = client.db(dbName);
        
                db.collection(collection)
                    .find(filter)
                    .toArray(function (err, data) {
                        if(err)console.log(err);
                        callback(data);
                    });
            }catch(err){
                console.log(err);
            }finally{
                client.close();
            }
        })();
    }

    create (collection, object, callback) {
        try {
            MongoClient.connect(url, mongoOptions, function (err, client) {
                assert.equal(null, err);
                const db = client.db(dbName);
        
                var myPromise = () => {
                    return new Promise((resolve, reject) => {
                        db.collection(collection).insert(object);
                        resolve();
                    });
                };
        
                var callMyPromise = async () => {
                    var result = await (myPromise());
                    return result;
                };
        
                callMyPromise().then(function (result) {
                    client.close();
                    callback(result);
                    
                    console.log("Finished Loading Book Data!");
                    res.redirect("/books");
                });
            });
        } catch (e) {
            console.log(e);
        }
    }

    update (collection, filter, object, callback) {
        try {
            MongoClient.connect(url, mongoOptions, function (err, client) {
                assert.equal(null, err);
                const db = client.db(dbName);
        
                var myPromise = () => {
                    var update = {};
                    object.map((key, value) => {
                        update[key] = {$replacewith: value};
                    });

                    return new Promise((resolve, reject) => {
                        db.collection(collection).updateOne(filter, update);
                        resolve();
                    });
                };
        
                var callMyPromise = async () => {
                    var result = await (myPromise());
                    return result;
                };
        
                callMyPromise().then(function (result) {
                    client.close();
                    callback(result);
                    
                    console.log("Finished Loading Book Data!");
                    res.redirect("/books");
                });
            });
        } catch (e) {
            console.log(e);
        }
    }

    delete (collection, id, callback) {
        try {
            MongoClient.connect(url, mongoOptions, function (err, client) {
                assert.equal(null, err);
                const db = client.db(dbName);
        
                var myPromise = () => {
                    return new Promise((resolve, reject) => {
                        db.collection(collection)
                            .deleteOne({_id: id});
                        resolve();
                    });
                };
        
                var callMyPromise = async () => {
                    var result = await (myPromise());
                    //anything here is executed after result is resolved
                    return result;
                };
        
                callMyPromise().then(function (result) {
                    client.close();
                    callback(result);
                });
            });
        } catch (e) {
            console.log(e);
        }
    }
}