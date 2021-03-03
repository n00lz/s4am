const { body, check } = require('express-validator');

// All middleware goes here
var middlewareObj = {};

middlewareObj.validation = (method) => {
    switch(method){
        case 'createUser': {
            return[
                body('name', 'Name is required').exists({ checkFalsy: true }),
                body('surname', 'Surname is required').exists({ checkFalsy: true }),
                body('username', 'Username is required').exists({ checkFalsy: true }),
                body('password').isLength({ min: 7 }).withMessage('must be at least 7 chars long').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/).withMessage('Must contain uppercase, lowercase and number')
            ]
        }
        case 'resetPassword': {
            return[
                check('newpass').isLength({ min: 7 }).withMessage('must be at least 7 chars long').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/).withMessage('Must contain uppercase, lowercase and number')
            ]
        }
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    next();
}

module.exports = middlewareObj;