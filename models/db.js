const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err)=>{
    if(!err){
        console.log('SYCCESSFULLY CONNECTED TO MONGODB');
    } else {
        console.log('Error: ' +JSON.stringify(err, undefined, 2));
    }
});

require('./user.model');