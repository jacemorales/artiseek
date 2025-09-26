const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../database');

// @route   POST api/applications/project/:id
// @desc    Apply for a project
// @access  Private (Freelancer only)
router.post('/project/:id', auth, async (req, res) => {
    const { proposal } = req.body;
    const projectId = req.params.id;
    const userId = req.user.id;

    try {
        const user = await db.findUserById(userId);
        if (!user || user.userType !== 'Freelancer') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const project = await db.getProjectById(projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // Check if user has already applied for this project
        const db_data = await db.readDB();
        const existingApplication = db_data.applications.find(app => app.projectId === projectId && app.userId === userId);
        if (existingApplication) {
            return res.status(400).json({ msg: 'You have already applied for this project' });
        }

        const newApplication = await db.createApplication({
            userId,
            projectId,
            proposal,
        });

        res.json(newApplication);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/applications/project/:id
// @desc    Get all applications for a project
// @access  Private (Client of the project only)
router.get('/project/:id', auth, async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user.id;

    try {
        const project = await db.getProjectById(projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        if (project.userId !== userId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const applications = await db.getApplicationsByProjectId(projectId);
        res.json(applications);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/applications/my
// @desc    Get my applications
// @access  Private (Freelancer only)
router.get('/my', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const applications = await db.getApplicationsByUserId(userId);
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/applications/:id
// @desc    Update an application status
// @access  Private (Client of the project only)
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;
    const applicationId = req.params.id;
    const userId = req.user.id;

    try {
        const db_data = await db.readDB();
        const application = db_data.applications.find(app => app.id === applicationId);
        if (!application) {
            return res.status(404).json({ msg: 'Application not found' });
        }

        const project = await db.getProjectById(application.projectId);
        if (project.userId !== userId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const updatedApplication = await db.updateApplication(applicationId, { status });
        res.json(updatedApplication);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
