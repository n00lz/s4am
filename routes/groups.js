const express   = require('express');
const middlewareObj = require('../middleware/index');
const router    = express.Router();
const middleware = require('../middleware/index');
const group     = require('../models/group');

// INDEX - Show all groups
router.get('/', middleware.isLoggedIn, async (req, res) => {
    var lsGroups = await group.getGroups();
    res.render('groups/index', {groups: lsGroups});
});

// CREATE - Add new group to database
router.post('/', async (req, res) => {
    var groupName = req.body.name;

    await group.createGroup(groupName);
    res.redirect('/');
});

// NEW - Show form to create new group
router.get('/add', middleware.isLoggedIn, (req, res) => {
    res.render('groups/add');
});

// SHOW - Show more info about one group

// EDIT GROUP

// UPDATE GROUP

// DESTROY GROUP
router.post('/del/:group', async (req, res) => {
    // res.send('Groupname: ' + req.params.group);
    let groupname = req.params.group;
    let result = await group.deleteGroup(groupname);
    if(result){
        return res.json({message:result.toString(), deleted:true});
    } else {
        return res.json({message:'No deleted group', deleted:false});
    }
    
});

module.exports = router;