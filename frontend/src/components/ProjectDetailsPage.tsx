import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken.ts';
import { Project } from '../types';

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [proposal, setProposal] = useState('');
    const [isFreelancer, setIsFreelancer] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get<Project>(`/api/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProject();

        if (localStorage.token) {
            setAuthToken(localStorage.token);
            // This is still a simplification. A proper implementation
            // would involve a global user context.
            setIsFreelancer(true);
        }

    }, [id]);

    const handleApply = async () => {
        try {
            await axios.post(`/api/applications/project/${id}`, { proposal });
            alert('Application submitted!');
        } catch (err: any) {
            console.error(err.response.data);
            alert('Error submitting application: ' + err.response.data.msg);
        }
    };

    if (!project) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <p>Budget: {project.budget}</p>
            {isFreelancer && (
                <div>
                    <h3>Apply for this project</h3>
                    <textarea
                        placeholder="Your proposal"
                        value={proposal}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProposal(e.target.value)}
                    />
                    <button onClick={handleApply}>Apply</button>
                </div>
            )}
        </div>
    );
};

export default ProjectDetailsPage;
