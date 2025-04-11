const mongoose = require('mongoose')
const users = require('../models/userSchema')

const paymentSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    amount : {
        type : Number,
        required : true
    }
})

const paymentModel = mongoose.model('payment',paymentSchema);
module.exports = paymentModel