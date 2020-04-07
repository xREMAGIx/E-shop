const mongoose = require("mongoose");
module.exports = mongoose.model('Promotions', new mongoose.Schema({
    giftCode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    skind: {
        type: String,
        enum: ["discount", "cash"],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    maximum: {
        type: Number,
        required: true
    },
    conditionsOfParticipation: {
        type: Number,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    users: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    }]
}))