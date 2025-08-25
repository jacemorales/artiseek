import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken.ts';
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
      await axios.put('/api/users/onboarding', formData);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err.response.data);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2>Step 1: Personal Information</h2>
            <input
              type="text"
              placeholder="Phone Number"
              name="phone"
              value={phone}
              onChange={onChange}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              name="dob"
              value={dob}
              onChange={onChange}
            />
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={location}
              onChange={onChange}
            />
            <button onClick={nextStep}>Next</button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 2: What are you looking for?</h2>
            <select name="userSpecificType" value={userSpecificType} onChange={onChange}>
                <option value="">Select...</option>
                <option value="digital">Digital</option>
                <option value="artisan">Artisan</option>
            </select>
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep}>Next</button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Step 3: Verification (Optional)</h2>
            <input
              type="text"
              placeholder="NIN"
              name="nin"
              value={nin}
              onChange={onChange}
            />
            <input
              type="text"
              placeholder="BVN"
              name="bvn"
              value={bvn}
              onChange={onChange}
            />
            <input
              type="text"
              placeholder="Driver's License"
              name="driversLicense"
              value={driversLicense}
              onChange={onChange}
            />
            <button onClick={prevStep}>Back</button>
            <button onClick={onSubmit}>Complete</button>
          </div>
        );
      default:
        return <div>Onboarding Complete!</div>;
    }
  };

  return (
    <div>
      <h1>Onboarding</h1>
      {renderStep()}
    </div>
  );
};

export default OnboardingPage;
