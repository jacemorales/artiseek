import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CreateServiceForm from './CreateServiceForm';
import { Service } from '../types';

const MyServicesPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get<Service[]>('/api/services/my');
                setServices(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchServices();
    }, []);

    const handleServiceCreated = (newService: Service) => {
        setServices([...services, newService]);
        setShowCreateForm(false);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Services</h2>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    {showCreateForm ? 'Cancel' : 'Add New Service'}
                </button>
            </div>

            {showCreateForm && <CreateServiceForm onServiceCreated={handleServiceCreated} />}

            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {services.map(service => (
                        <li key={service.id} className="p-4 hover:bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">{service.title}</h3>
                            <p className="mt-1 text-sm text-gray-600">{service.description}</p>
                            <p className="mt-2 text-sm font-semibold text-gray-800">Price: ${service.price}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyServicesPage;
