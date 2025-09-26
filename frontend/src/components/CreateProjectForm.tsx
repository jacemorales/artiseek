import React, { useState, ChangeEvent, FormEvent } from 'react';
import api from '../api/axios';
import { Project } from '../types';

interface CreateProjectFormProps {
  onProjectCreated: (newProject: Project) => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onProjectCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        category: '',
    });

    const { title, description, budget, category } = formData;

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await api.post<Project>('/api/projects', {
                ...formData,
                budget: Number(budget)
            });
            onProjectCreated(res.data);
            // Reset form
            setFormData({ title: '', description: '', budget: '', category: '' });
        } catch (err: any) {
            console.error(err.response.data);
        }
    };

    return (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <form onSubmit={onSubmit} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Project</h3>
                <div>
                    <label htmlFor="proj-title" className="sr-only">Title</label>
                    <input type="text" placeholder="Title" name="title" id="proj-title" value={title} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="proj-desc" className="sr-only">Description</label>
                    <textarea placeholder="Description" name="description" id="proj-desc" value={description} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="proj-budget" className="sr-only">Budget</label>
                        <input type="number" placeholder="Budget" name="budget" id="proj-budget" value={budget} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="proj-cat" className="sr-only">Category</label>
                        <input type="text" placeholder="Category" name="category" id="proj-cat" value={category} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Create Project
                </button>
            </form>
        </div>
    );
};

export default CreateProjectForm;
