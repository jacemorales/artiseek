import React, { useState } from 'react';
import axios from 'axios';

const CreateServiceForm = ({ onServiceCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
    });

    const { title, description, price, category } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/services', formData);
            onServiceCreated(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h3>Create New Service</h3>
            <input type="text" placeholder="Title" name="title" value={title} onChange={onChange} required />
            <textarea placeholder="Description" name="description" value={description} onChange={onChange} required />
            <input type="number" placeholder="Price" name="price" value={price} onChange={onChange} required />
            <input type="text" placeholder="Category" name="category" value={category} onChange={onChange} required />
            <button type="submit">Create Service</button>
        </form>
    );
};

export default CreateServiceForm;
