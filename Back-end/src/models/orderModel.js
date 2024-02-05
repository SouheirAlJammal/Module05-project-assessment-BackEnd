import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    shippingAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Approved", "Rejected", "Pending"],
        default: "Pending",
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true,

    },
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: Number,
    }],

},{
    timestamps: true

});
const order = mongoose.model('Order', orderSchema)


export default order;