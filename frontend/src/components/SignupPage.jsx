import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [userType, setUserType] = useState('Client');

  return (
    <div>
      <h2>Sign Up</h2>
      <div>
        <button onClick={() => setUserType('Client')}>Client</button>
        <button onClick={() => setUserType('Freelancer')}>Freelancer</button>
      </div>
      <form>
        <h3>{userType} Sign Up</h3>
        <div>
          <label>First Name</label>
          <input type="text" />
        </div>
        <div>
          <label>Surname</label>
          <input type="text" />
        </div>
        <div>
          <label>Email</label>
          <input type="email" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" />
        </div>
        <div>
          <label>Repeat Password</label>
          <input type="password" />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;
