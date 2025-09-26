import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateServiceForm from './CreateServiceForm';

const MyServicesPage = () => {
    const [services, setServices] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('/api/services/my');
                setServices(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchServices();
    }, []);

    const handleServiceCreated = (newService) => {
        setServices([...services, newService]);
        setShowCreateForm(false);
    };

    return (
        <div>
            <h2>My Services</h2>
            <button onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Cancel' : 'Add New Service'}
            </button>
            {showCreateForm && <CreateServiceForm onServiceCreated={handleServiceCreated} />}
            <ul>
                {services.map(service => (
                    <li key={service.id}>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <p>Price: {service.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyServicesPage;
