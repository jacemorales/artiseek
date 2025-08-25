import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CreateProjectForm from './CreateProjectForm';
import { Project } from '../types';

const MyProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get<Project[]>('/api/projects/my');
                setProjects(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProjects();
    }, []);

    const handleProjectCreated = (newProject: Project) => {
        setProjects([...projects, newProject]);
        setShowCreateForm(false);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    {showCreateForm ? 'Cancel' : 'Add New Project'}
                </button>
            </div>

            {showCreateForm && <CreateProjectForm onProjectCreated={handleProjectCreated} />}

            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {projects.map(project => (
                        <li key={project.id} className="p-4 hover:bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                            <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                            <p className="mt-2 text-sm font-semibold text-gray-800">Budget: ${project.budget}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyProjectsPage;
