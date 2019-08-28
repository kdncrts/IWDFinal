const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
const ModelUtils = new (require('../utils/ModelUtils'))();
const bcrypt = require('bcrypt');

// Mongo variables
const url = 'mongodb+srv://admin_MTM282:admin_MTM282@cluster0-mug8p.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'pug';
var mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

var router = express.Router();

const getMongo = (collection, filter, callback) => {
    return async function(){
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
    }
}


// These routes use the Promise Example I posted
router.route("/").get(
    function(req, res){
        var model = {
            header: ModelUtils.buildHeader("/", null /* would be a user here */),
        }
        res.render("index", model);
    }
);

router.route("/cards").get(
    function(req, res){
    (getMongo("cards", {}, data => {
        let cards = {};
        data.forEach((card) => {
            if(!cards[card.type]){
                cards[card.type] = {
                    cards: [],
                    name: card.type
                };
            }
            cards[card.type].cards.push(card);
        })

        const model = {
            header: ModelUtils.buildHeader("/cards", null /* would be a user here */),
            cards
        }
        // Send the response using our Books Template and model
        res.render("cards", model);
    })());
    }
);

router.route("/buy").get(
    function(req, res){
    (getMongo("cards", {id: Number(req.query.card)}, data => {
        const model = {
            header: ModelUtils.buildHeader("/buy", null /* would be a user here */),
            card: data ? data[0] : null
        }
        
        if(data.length){
            res.render("buy", model);
        } else {
            res.render("cardNotFound", model);
        }
    })());
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