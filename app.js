const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session);

const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
 
    // using FileStore with express-session
    // as the sore method, replacing the default memory store
    store: new FileStore({

        path: './session-store'

    }),
    name: 'Trading Cards', // cookie will show up as foo site
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // five year cookie
        maxAge: 1000 * 60 * 10
    }}));


var adminRoutes = require('./routes/adminRoutes');
app.use("/admin/", adminRoutes);
var routes = require('./routes/routes');
app.use("/", routes);

app.listen(port, function(){
    console.log("Express listening on port " + port);
});