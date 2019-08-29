const express = require('express');
const ModelUtils = new (require('../utils/ModelUtils'))();

// Mongo variables
var router = express.Router();

// These routes use the Promise Example I posted
router.route("/loadData").get(
    function(req, res){
        
    }
);

router.route("/deleteData").get(
    function(req, res){
        
    }
);

module.exports = router;