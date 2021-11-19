const express   = require('express');
const bcrypt    = require('bcrypt');
const Login     = require('../models/login');
const User      = require('../models/user');
const middleware = require('../middleware/index');
const router    = express.Router();

router.get('/', middleware.isLoggedIn, async (req, res) => {
    let dUsers = await User.disabledUsers();
    let listUsers = dUsers;
    res.render('index', {disabledUsers: listUsers});
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const foundUser = await Login.findAndValidate(username, password);
    if(foundUser){
        // Add user id to a session
        req.session.user_id = foundUser._id;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

router.post('/logout', (req, res) => {
    // Remove user id from session
    // req.session.user_id = null;
    // Destroy whole session, this is better way if there is a lot of info in the session
    req.session.destroy();
    res.redirect('/login');
});

// router.post('/register', async (req, res) => {
//     // Should have register form for this to work
//     let {username, password} = req.body;
//     const login = new Login({ username, password });
//     await login.save();
//     req.session.user_id = user._id;
//     console.log(hash);
// })

module.exports = router;