const mngs = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


var userSchema = new mngs.Schema({
    fullName: {
        type: String,
        required: 'Name is required.'
    },
    email: {
        type: String,
        unique: true,
        required: 'Email is required.'
    },
    password: {
        type: String,
        required: 'Password is required.',
        minlength: [4, 'Password shoul be at least 4 characters.']
    },
    userName:{
        type: String,
        required: 'Username is required.',
        unique: true
    },
    saltSecret: String
});

userSchema.methods.verifyPassword = function(password) {
    console.log('came here too')
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.generateJwt = function() {
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXP});
}

userSchema.path('email').validate((val)=>{
    emailRegEx = /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    return emailRegEx.test(val);
}, 'Invalid email.')

userSchema.pre('save', function(next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        })
    })
})


// Methods
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

function generate_random_string(string_length){
    let random_string = '';
    let random_ascii;
    for(let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii)
    }
    console.log('random_string: ', random_string)
    return random_string
}

mngs.model('User', userSchema);