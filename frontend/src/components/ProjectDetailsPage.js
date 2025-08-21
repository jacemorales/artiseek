import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [proposal, setProposal] = useState('');
    const [isFreelancer, setIsFreelancer] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`/api/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProject();

        // This is a simplified way to check user type.
        // In a real app, this would come from a global state/context.
        if (localStorage.token) {
            setAuthToken(localStorage.token);
            // We don't have the user object here, so we can't check the userType.
            // For now, we'll assume if the user is logged in, they might be a freelancer.
            // The backend will handle the authorization.
            setIsFreelancer(true);
        }

    }, [id]);

    const handleApply = async () => {
        try {
            await axios.post(`/api/applications/project/${id}`, { proposal });
            alert('Application submitted!');
        } catch (err) {
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
                        onChange={e => setProposal(e.target.value)}
                    />
                    <button onClick={handleApply}>Apply</button>
                </div>
            )}
        </div>
    );
};

export default ProjectDetailsPage;
