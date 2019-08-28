// const express = require('express');
// const ModelUtils = new (require('./utils/ModelUtils'))();

// // QoL
// // Nodemon, FS, Loading JSON? Template Inheritance

// const port = 3000;
// const app = express();

// app.set('view engine', 'pug');
// app.use(express.static(__dirname + "/public"));

// app.get('/', function(req, res){
//     const model = {
//         header: ModelUtils.buildHeader("/", null /* would be a user here */),
//     }
//     res.render("index", model);
// });

// app.get('/cards', function(req, res){
//     const cardsFromJson = require(__dirname + "/data/cards.json").cards;
//     let cards = {};
//     cardsFromJson.forEach((card) => {
//         if(!cards[card.type]){
//             cards[card.type] = {
//                 cards: [],
//                 name: card.type
//             };
//         }
//         cards[card.type].cards.push(card);
//     })
//     const model = {
//         header: ModelUtils.buildHeader("/cards", null /* would be a user here */),
//         cards,
//     }
//     res.render("cards", model);
// });

// app.get('/buy', function(req, res){
//     const cardsFromJson = require(__dirname + "/data/cards.json").cards;
//     const card = cardsFromJson.filter((card) => card.id == req.query.card);
//     const model = {
//         header: ModelUtils.buildHeader("/buy", null /* would be a user here */),
//         card: card[0],
//     }
//     if(card.length){
//         res.render("buy", model);
//     } else {
//         res.render("cardNotFound", model);
//     }
// });

// app.listen(port, function(){
//     console.log("Express listening on port " + port);
// });





const express = require('express');

const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + "/public"));

var adminRoutes = require('./routes/adminRoutes');
app.use("/admin/", adminRoutes);
var routes = require('./routes/routes');
app.use("/", routes);

app.listen(port, function(){
    console.log("Express listening on port " + port);
});