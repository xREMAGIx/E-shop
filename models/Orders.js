const mongoose = require("mongoose");
const Orders_schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    payment: {
        type: String,
        required: true
    },
    dateOrder: {
        type: Date, required: true
    }
})
module.exports = mongoose.model('oders', Orders_schema);
