const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const _ = require('lodash');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.userName = req.body.userName;
    user.save((err, doc) => {
        if (!err) {
            res.send(doc)
        } else {
            if (err.code === 11000) {
                res.send(['Email and Username should be unique'])
            } else {
                console.log('Error: ' + err)
                return next(err);
            }

        }
    })
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(404).json(err);
        // registered user
        if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(401).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id }, (err, user) => {
        if (!err) {
            if (!user) {
                return res.status(404).json({ status: false, message: 'User not found' })
            }
            else
                return res.status(200).json({ status: true, user: _.pick(user, ['fullName', 'userName']) })
        } else {
            console.log('Error', err)
        }

    })
}

