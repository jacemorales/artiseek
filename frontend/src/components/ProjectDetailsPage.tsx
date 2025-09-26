import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import setAuthToken from '../utils/setAuthToken';
import { Project, User } from '../types';
import TopMenu from './TopMenu.tsx';
import SideMenu from './SideMenu.tsx';

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [proposal, setProposal] = useState('');
    const [isFreelancer, setIsFreelancer] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (localStorage.token) {
                setAuthToken(localStorage.token);
                try {
                    const userRes = await api.get<User>('/api/users/me');
                    setCurrentUser(userRes.data);
                    if (userRes.data.userType === 'Freelancer') {
                        setIsFreelancer(true);
                    }
                } catch(err) {
                    console.error("Could not fetch user");
                }
            }
            try {
                const res = await api.get<Project>(`/api/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        loadData();
    }, [id]);

    const handleApply = async () => {
        try {
            await api.post(`/api/applications/project/${id}`, { proposal });
            alert('Application submitted!');
            setProposal('');
        } catch (err: any) {
            console.error(err.response.data);
            alert('Error submitting application: ' + err.response.data.msg);
        }
    };

    if (!project || !currentUser) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <TopMenu user={currentUser} onPurchase={() => {}} />
            <div className="flex">
                <SideMenu userType={currentUser.userType} />
                <main className="flex-grow p-6">
                    <div className="bg-white p-8 rounded-lg shadow-md w-full">
                        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                        <p className="mt-2 text-lg text-gray-700">Category: {project.category}</p>
                        <p className="mt-4 text-gray-600">{project.description}</p>
                        <p className="mt-4 text-2xl font-bold text-indigo-600">Budget: ${project.budget}</p>

                        {isFreelancer && (
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-xl font-bold text-gray-900">Apply for this project</h3>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label htmlFor="proposal" className="sr-only">Your Proposal</label>
                                        <textarea
                                            id="proposal"
                                            placeholder="Write your proposal here..."
                                            value={proposal}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProposal(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                            rows={5}
                                        />
                                    </div>
                                    <button onClick={handleApply} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                        Submit Application
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
