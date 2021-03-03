const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank.']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank.']
    }
})

// In statics can define multiple methods that will be added to the login class
loginSchema.statics.findAndValidate = async function(username, password){
    // Find a user with username specified in login form
    const foundUser = await this.findOne({ username });
    if(!foundUser){
        return false;
    }
    // Hash a password from the input form and compare it to the already hashed password for the user in database
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

// Run some functions before saveing to database
// Every time when save a user to database this pre function will be executed to hash the password
loginSchema.pre('save', async function(next){
    // Rehash password only if the passward is modified
    if(!this.isModified('password')) return next();
    // In this case this keyword refers to login model
    this.password = await bcrypt.hash(this.password, 12);
    next()
})

module.exports = mongoose.model('Login', loginSchema);