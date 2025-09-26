import React, { useState } from 'react';
import axios from 'axios';

const CreateProjectForm = ({ onProjectCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        category: '',
    });

    const { title, description, budget, category } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/projects', formData);
            onProjectCreated(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h3>Create New Project</h3>
            <input type="text" placeholder="Title" name="title" value={title} onChange={onChange} required />
            <textarea placeholder="Description" name="description" value={description} onChange={onChange} required />
            <input type="number" placeholder="Budget" name="budget" value={budget} onChange={onChange} required />
            <input type="text" placeholder="Category" name="category" value={category} onChange={onChange} required />
            <button type="submit">Create Project</button>
        </form>
    );
};

export default CreateProjectForm;
