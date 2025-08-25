import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const EmailVerificationPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('No verification token found.');
                return;
            }
            try {
                const res = await api.get(`/api/users/verify/${token}`);
                setStatus('success');
                setMessage(res.data.msg);
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.msg || 'An error occurred during verification.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
                <p className="text-lg">{message}</p>
                {status === 'success' && (
                    <Link to="/login" className="mt-6 inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Proceed to Login
                    </Link>
                )}
                {status === 'error' && (
                     <Link to="/signup" className="mt-6 inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                        Return to Signup
                    </Link>
                )}
            </div>
        </div>
    );
};

export default EmailVerificationPage;
