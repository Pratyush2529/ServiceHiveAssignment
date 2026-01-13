const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    gigId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Gig',
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Please provide a proposal message'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide a bid price'],
        min: [1, 'Price must be at least 1']
    },
    status: {
        type: String,
        enum: ['pending', 'hired', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });


bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model('Bid', bidSchema);
