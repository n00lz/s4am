const express   = require('express');
const router    = express.Router();
const user      = require('../models/user');
const { validationResult } = require('express-validator');
const middleware= require('../middleware');

// INDEX - Show all users
router.get('/', middleware.isLoggedIn, (req, res) => {
    let lsUsers = user.getUsers();
    res.render('users/index', {users: lsUsers});
    // req.flash('success', 'Great you did it!');
    // res.redirect('back');
});

// CREATE - Add new user to database
router.post('/', middleware.validation('createUser'), (req, res) => {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    var givenName = req.body.name;
    var surname = req.body.surname;
    var username = req.body.username;
    var password = req.body.password;
    // const user = new User(username,password,givenName,surname);
    user.createUser(username,password,givenName,surname);
    res.redirect('/');
});

// NEW - Show form to create new user
router.get('/add', middleware.isLoggedIn, (req, res) => {
    res.render('users/add');
});

// SHOW - Show more info about one user

// EDIT USER
router.get('/reset', middleware.isLoggedIn, (req, res) => {
    let username = req.query.username;
    let password = req.query.password;
    // console.log(req.query);
    let result = user.resetPassword(username, password);
    if(result){
        return res.json({message:result.toString(), deleted:true});
    } else {
        return res.json({message:'Password was not change.', deleted:false});
    }
});

router.get('/dis/:user', (req, res) => {
    let username = req.params.user;
    let result = user.disableUser(username);
    if(result){
        return res.json({message:result.toString(), deleted:true});
    } else {
        return res.json({message:'No disabled user', deleted:false});
    }
    
});

router.get('/enable/:user', (req, res) => {
    let username = req.params.user;
    let result = user.enableUser(username);
    if(result){
        return res.json({message:result.toString(), deleted:true});
    } else {
        return res.json({message:'No disabled user', deleted:false});
    }
    
});

// UPDATE USER

// DESTROY USER
router.post('/del/:user', (req, res) => {
    // res.send('Groupname: ' + req.params.group);
    let username = req.params.user;
    let result = user.deleteUser(username);
    if(result){
        return res.json({message:result.toString(), deleted:true});
    } else {
        return res.json({message:'No deleted user', deleted:false});
    }
    
});

module.exports = router;