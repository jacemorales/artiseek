import React, { useState, ChangeEvent } from 'react';
import api from '../api/axios';
import setAuthToken from '../utils/setAuthToken';
import { useNavigate } from 'react-router-dom';

interface FormData {
  phone: string;
  dob: string;
  location: string;
  userSpecificType: 'digital' | 'artisan' | '';
  nin: string;
  bvn: string;
  driversLicense: string;
}

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    dob: '',
    location: '',
    userSpecificType: '',
    nin: '',
    bvn: '',
    driversLicense: '',
  });
  const navigate = useNavigate();

  const { phone, dob, location, userSpecificType, nin, bvn, driversLicense } = formData;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      await api.put('/api/users/onboarding', formData);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err.response.data);
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const buttonClass = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700";
  const secondaryButtonClass = "w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50";


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Step 1: Personal Information</h2>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
              <input type="text" placeholder="Phone Number" name="phone" id="phone" value={phone} onChange={onChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" name="dob" id="dob" value={dob} onChange={onChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" placeholder="Location" name="location" id="location" value={location} onChange={onChange} className={inputClass} />
            </div>
            <button onClick={nextStep} className={buttonClass}>Next</button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Step 2: What are you looking for?</h2>
            <div>
                <label htmlFor="userSpecificType" className="block text-sm font-medium text-gray-700">I am a...</label>
                <select name="userSpecificType" id="userSpecificType" value={userSpecificType} onChange={onChange} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="digital">Digital Professional</option>
                    <option value="artisan">Artisan</option>
                </select>
            </div>
            <div className="flex space-x-4">
                <button onClick={prevStep} className={secondaryButtonClass}>Back</button>
                <button onClick={nextStep} className={buttonClass}>Next</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Step 3: Verification (Optional)</h2>
             <div>
              <label htmlFor="nin" className="block text-sm font-medium text-gray-700">NIN</label>
              <input type="text" placeholder="NIN" name="nin" id="nin" value={nin} onChange={onChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="bvn" className="block text-sm font-medium text-gray-700">BVN</label>
              <input type="text" placeholder="BVN" name="bvn" id="bvn" value={bvn} onChange={onChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="driversLicense" className="block text-sm font-medium text-gray-700">Driver's License</label>
              <input type="text" placeholder="Driver's License" name="driversLicense" id="driversLicense" value={driversLicense} onChange={onChange} className={inputClass} />
            </div>
            <div className="flex space-x-4">
                <button onClick={prevStep} className={secondaryButtonClass}>Back</button>
                <button onClick={onSubmit} className={buttonClass}>Complete</button>
            </div>
          </div>
        );
      default:
        return <div>Onboarding Complete!</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Complete Your Profile</h1>
            {renderStep()}
        </div>
    </div>
  );
};

export default OnboardingPage;
