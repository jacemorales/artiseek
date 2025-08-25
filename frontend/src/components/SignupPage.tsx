import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    password: '',
    password2: '',
  });
  const [userType, setUserType] = useState<'Client' | 'Freelancer'>('Client');
  const navigate = useNavigate();

  const { firstName, surname, email, password, password2 } = formData;

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== password2) {
      alert('Passwords do not match');
      return;
    }
    try {
      const newUser = {
        firstName,
        surname,
        email,
        password,
        userType,
      };
      await api.post('/api/users/register', newUser);
      alert('Verification email sent! Please check your inbox.');
      navigate('/login');
    } catch (err: any) {
      console.error(err.response.data);
      alert(err.response.data.msg || 'An error occurred');
    }
  };

  const getButtonClass = (type: 'Client' | 'Freelancer') => {
    return userType === type
      ? 'w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600'
      : 'w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create your account</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setUserType('Client')} className={getButtonClass('Client')}>
            I'm a Client
          </button>
          <button onClick={() => setUserType('Freelancer')} className={getButtonClass('Freelancer')}>
            I'm a Freelancer
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <h3 className="text-lg font-medium text-center text-gray-900">{userType} Sign Up</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" id="firstName" value={firstName} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname</label>
              <input type="text" name="surname" id="surname" value={surname} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email-signup" value={email} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" id="password-signup" value={password} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Repeat Password</label>
            <input type="password" name="password2" id="password2" value={password2} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
