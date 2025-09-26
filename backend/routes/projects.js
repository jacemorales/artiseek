const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../database');

// @route   POST api/projects
// @desc    Create a project
// @access  Private (Client only)
router.post('/', auth, async (req, res) => {
    const { title, description, budget, category } = req.body;
    const userId = req.user.id;

    try {
        const user = await db.findUserById(userId);
        if (!user || user.userType !== 'Client') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const newProject = await db.createProject({
            userId,
            title,
            description,
            budget,
            category,
        });

        res.json(newProject);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const projects = await db.getProjects();
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/projects/my
// @desc    Get my projects
// @access  Private (Client only)
router.get('/my', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const projects = await db.getProjectsByUserId(userId);
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const project = await db.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private (Client only)
router.put('/:id', auth, async (req, res) => {
    const { title, description, budget, category } = req.body;
    const userId = req.user.id;
    const projectId = req.params.id;

    try {
        const project = await db.getProjectById(projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        if (project.userId !== userId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const updatedProject = await db.updateProject(projectId, { title, description, budget, category });
        res.json(updatedProject);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private (Client only)
router.delete('/:id', auth, async (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;

    try {
        const project = await db.getProjectById(projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        if (project.userId !== userId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await db.deleteProject(projectId);
        res.json({ msg: 'Project removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
