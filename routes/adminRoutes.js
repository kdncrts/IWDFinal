const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
const ModelUtils = new (require('../utils/ModelUtils'))();

// Mongo variables
const url = 'mongodb+srv://admin_MTM282:admin_MTM282@cluster0-mug8p.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'test';
var mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
var router = express.Router();

// These routes use the Promise Example I posted
router.route("/loadData").get(
    function(req, res){
        try {
            MongoClient.connect(url, mongoOptions, function (err, client) {
                assert.equal(null, err);
                const db = client.db(dbName);
        
                var myPromise = () => {
                    return new Promise((resolve, reject) => {
                        var jsonBooks = require('../data/books.json').books;
                        db.collection("books").insertMany(jsonBooks);
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
                    console.log("Finished Loading Book Data!");
                    res.redirect("/books");
                });
            });
        } catch (e) {
            console.log(e);
        }
    }
);

router.route("/deleteData").get(
    function(req, res){
        try {
            MongoClient.connect(url, mongoOptions, function (err, client) {
                assert.equal(null, err);
                const db = client.db(dbName);
        
                var myPromise = () => {
                    return new Promise((resolve, reject) => {
                        var jsonBooks = require('../data/books.json').books;
                        jsonBooks.forEach(function(book){
                            db.collection('books')
                            .deleteOne({_id:book._id});
                        });
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
                    console.log("Finished Deleting Book Data!");
                    res.redirect("/books");
                });
            });
        } catch (e) {
            console.log(e);
        }
    }
);

module.exports = router;