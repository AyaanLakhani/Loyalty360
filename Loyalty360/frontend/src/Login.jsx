// src/components/Login.jsx
import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';  
import axios from 'axios';

function Login() {
  const { ready, authenticated, user, login } = usePrivy(); // Removed logout from destructuring
  const navigate = useNavigate();

  //Tracking change in the data changes in the database.
  useEffect(() => {
    if (authenticated && user) {
      axios.post('http://localhost:5000/api/users',{
        userId: user.id,
        wallet: user.wallet?.address,
        phoneNumber: user.phone?.number,
        email: user.email?.address,
        linkedAccounts: user.linkedAccounts,
      }).then(() => {
        console.log('Backend updated');
      }).catch(err => {
        console.error('Error updating info:', err);
      });

      navigate('/');
    }
  }, [authenticated, user, navigate]);

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (authenticated) {
    //navigate('/'); // Redirect immediately after login
    return null; // Don't render anything in the Login component
  }

  return (
    <button onClick={login}>Get Started</button>
  );
}

export default Login;


