const Gig = require('../models/Gig');

exports.getAllGigs = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { status: 'open' };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const gigs = await Gig.find(query)
            .populate('ownerId', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: gigs.length,
            data: { gigs }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.createGig = async (req, res) => {
    try {
        const { title, description, budget } = req.body;

        const newGig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: { gig: newGig }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        res.status(200).json({
            status: 'success',
            data: { gig }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
