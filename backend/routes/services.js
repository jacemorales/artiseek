const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../database');

// @route   POST api/services
// @desc    Create a service
// @access  Private (Freelancer only)
router.post('/', auth, async (req, res) => {
    const { title, description, price, category } = req.body;
    const userId = req.user.id;

    try {
        const user = await db.findUserById(userId);
        if (!user || user.userType !== 'Freelancer') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const newService = await db.createService({
            userId,
            title,
            description,
            price,
            category,
        });

        res.json(newService);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
    try {
        const services = await db.getServices();
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/services/my
// @desc    Get my services
// @access  Private (Freelancer only)
router.get('/my', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const services = await db.getServicesByUserId(userId);
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const service = await db.getServiceById(req.params.id);
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }
        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/services/:id
// @desc    Update a service
// @access  Private (Freelancer only)
router.put('/:id', auth, async (req, res) => {
    const { title, description, price, category } = req.body;
    const userId = req.user.id;
    const serviceId = req.params.id;

    try {
        const service = await db.getServiceById(serviceId);
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        if (service.userId !== userId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const updatedService = await db.updateService(serviceId, { title, description, price, category });
        res.json(updatedService);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private (Freelancer only)
router.delete('/:id', auth, async (req, res) => {
    const userId = req.user.id;
    const serviceId = req.params.id;

    try {
        const service = await db.getServiceById(serviceId);
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        if (service.userId !== userId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await db.deleteService(serviceId);
        res.json({ msg: 'Service removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
