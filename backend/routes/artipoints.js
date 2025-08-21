const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../database');

// @route   POST api/artipoints/purchase
// @desc    Purchase Artipoints
// @access  Private
router.post('/purchase', auth, async (req, res) => {
    const { points } = req.body;
    const userId = req.user.id;

    try {
        const user = await db.findUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // In a real application, you would integrate with a payment gateway here.
        // For now, we'll just simulate a successful payment.

        const updatedUser = await db.updateUser(userId, {
            artipoints: user.artipoints + points,
        });

        res.json(updatedUser);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/artipoints/spend
// @desc    Spend Artipoints
// @access  Private
router.post('/spend', auth, async (req, res) => {
    const { points } = req.body;
    const userId = req.user.id;

    try {
        const user = await db.findUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.artipoints < points) {
            return res.status(400).json({ msg: 'Not enough Artipoints' });
        }

        const updatedUser = await db.updateUser(userId, {
            artipoints: user.artipoints - points,
        });

        res.json(updatedUser);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/artipoints/monthly-free-points
// @desc    Get monthly free Artipoints
// @access  Private
router.post('/monthly-free-points', auth, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await db.findUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // In a real application, this would be a cron job.
        // We would also need to check if the user has already received their free points for the month.
        // For now, we'll just add 100 points.

        const updatedUser = await db.updateUser(userId, {
            artipoints: user.artipoints + 100,
        });

        res.json(updatedUser);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
