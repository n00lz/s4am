const express   = require('express');
// const User      = require('./models/user');
// const group     = require('./models/group');
const app       = express();
const bodyParser= require('body-parser');
const mongoose  = require('mongoose');
const session   = require('express-session');
// const passport  = require('passport');
// const LocalStrategy = require('passport-local');
const Login     = require('./models/login');
const flash     = require('connect-flash');
const fs        = require('fs');
const server    = require('http').createServer(app);


// Require routes
const groupsRoutes = require('./routes/groups');
const usersRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');

// DB Connection
let url = process.env.CONNECTIONSTRING || "mongodb://localhost:27017/s4am";
mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to DB!');
}).catch(err => {
    console.log('ERROR: ', err.message);
});

// Serve static files
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(flash());


// Setup express session, required for flash function
app.use(session({
    secret: 'wwfx',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 60000 }
}));

// Middleware functions to be called before every route
// Whatever we put on res.locals will be available in templates
app.use(function(req, res, next){
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(indexRoutes);
app.use('/users', usersRoutes);
app.use('/groups', groupsRoutes);

server.listen(process.env.NODE_PORT || 3000);
