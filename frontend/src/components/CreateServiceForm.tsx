import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Service } from '../types';

interface CreateServiceFormProps {
  onServiceCreated: (newService: Service) => void;
}

const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ onServiceCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
    });

    const { title, description, price, category } = formData;

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post<Service>('/api/services', {
                ...formData,
                price: Number(price)
            });
            onServiceCreated(res.data);
            // Reset form
            setFormData({ title: '', description: '', price: '', category: '' });
        } catch (err: any) {
            console.error(err.response.data);
        }
    };

    return (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <form onSubmit={onSubmit} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Service</h3>
                <div>
                    <label htmlFor="title" className="sr-only">Title</label>
                    <input type="text" placeholder="Title" name="title" id="title" value={title} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="description" className="sr-only">Description</label>
                    <textarea placeholder="Description" name="description" id="description" value={description} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="sr-only">Price</label>
                        <input type="number" placeholder="Price" name="price" id="price" value={price} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="category" className="sr-only">Category</label>
                        <input type="text" placeholder="Category" name="category" id="category" value={category} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Create Service
                </button>
            </form>
        </div>
    );
};

export default CreateServiceForm;
