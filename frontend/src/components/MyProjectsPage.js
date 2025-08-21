import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateProjectForm from './CreateProjectForm';

const MyProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('/api/projects/my');
                setProjects(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProjects();
    }, []);

    const handleProjectCreated = (newProject) => {
        setProjects([...projects, newProject]);
        setShowCreateForm(false);
    };

    return (
        <div>
            <h2>My Projects</h2>
            <button onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Cancel' : 'Add New Project'}
            </button>
            {showCreateForm && <CreateProjectForm onProjectCreated={handleProjectCreated} />}
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <p>Budget: {project.budget}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyProjectsPage;
