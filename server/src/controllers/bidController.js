const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const mongoose = require('mongoose');

exports.createBid = async (req, res) => {
    try {
        const { gigId, message, price } = req.body;


        const gig = await Gig.findById(gigId);
        if (!gig) return res.status(404).json({ message: 'Gig not found' });
        if (gig.status !== 'open') return res.status(400).json({ message: 'Gig is no longer open for bids' });


        if (gig.ownerId.toString() === req.user.id) {
            return res.status(400).json({ message: 'You cannot bid on your own gig' });
        }

        const newBid = await Bid.create({
            gigId,
            message,
            price,
            freelancerId: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: { bid: newBid }
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'You have already placed a bid on this gig' });
        }
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getBidsForGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.gigId);
        if (!gig) return res.status(404).json({ message: 'Gig not found' });


        if (gig.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only the gig owner can view bids' });
        }

        const bids = await Bid.find({ gigId: req.params.gigId })
            .populate('freelancerId', 'name email text')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            data: { bids }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.hireFreelancer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { bidId } = req.params;


        const bid = await Bid.findById(bidId).session(session);
        if (!bid) throw new Error('Bid not found');
        if (bid.status !== 'pending') throw new Error('Bid is not pending');

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig) throw new Error('Gig not found');
        if (gig.status !== 'open') throw new Error('Gig is already assigned');


        if (gig.ownerId.toString() !== req.user.id) {
            throw new Error('You are not authorized to hire for this gig');
        }



        gig.status = 'assigned';
        await gig.save({ session });


        bid.status = 'hired';
        await bid.save({ session });


        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bidId } },
            { status: 'rejected' },
            { session }
        );

        await session.commitTransaction();
        session.endSession();


        const io = req.app.get('io');
        io.to(bid.freelancerId.toString()).emit('hired', {
            message: `You have been hired for "${gig.title}"!`,
            gigId: gig._id
        });

        res.status(200).json({
            status: 'success',
            message: 'Freelancer hired successfully'
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
