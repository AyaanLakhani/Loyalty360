import React, { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Link, useNavigate } from 'react-router-dom';  // Use useNavigate for navigation
import './Homepage.css';
import axios from 'axios';
import { FaUserCircle } from "react-icons/fa";  // Ensure you import the icon

function Home() {
  const { login, authenticated, logout, user } = usePrivy();  // Include 'user' here
  const navigate = useNavigate();  // For navigation

  // Send user data to backend only when authenticated and user is available
  useEffect(() => {
    if (authenticated && user) {
      console.log('Sending user to backend:', {
        userId: user.id,
        wallet: user.wallet?.address,
        phone: user.phone?.number,
        email: user.email?.address,
        linkedAccounts: user.linkedAccounts,
      });

      axios.post('http://localhost:5000/api/users', {
        userId: user.id,
        wallet: user.wallet?.address,
        phone: user.phone?.number,
        email: user.email?.address,
        linkedAccounts: user.linkedAccounts,
      }).then(() => {
        console.log('User data sent to backend');
      }).catch(err => {
        console.error('Error sending user data:', err);
      });
    }
  }, [authenticated, user]);  // Added 'user' as a dependency

  // Function to navigate to profile page
  const handleProfileClick = () => {
    navigate('/Profilepage');
  };
  return (
    <div className="homepage-container">
      <header className="main-header">
        <div className="logo-container">
          <img src="/360Logo.jpg" alt="Your Company Logo" className="logo" />
          <span style={{ color: '#5e6f9a', fontWeight: 'bold', marginRight: '1px' }}>Xchange</span>
          <span style={{ color: '#89ebde', fontWeight: 'bold' }}>360</span>
        </div>
        
        <nav className="main-nav"> 
          <ul className="nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Listings">Rewards</Link></li>
            <li><Link to="/marketplace">Marketplace</Link> </li> 
            {authenticated ? (
              <>
                {/* Profile button with navigation */}
                <li>
                  <button onClick={handleProfileClick} className="profile-button">
                    <FaUserCircle size={24} />
                  </button>
                </li>
                <li>
                  <button onClick={logout} className="login-button">Logout</button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={login} className="login-button">Login</button>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main className="hero-section">
        <div className="hero-text">
          <h1 className="hero-headline">OUR LOYALTY PROGRAM</h1>
          <p className="hero-subheadline">
            A blockchain-based loyalty exchange program where users can collect, exchange, and redeem tokens for rewards offered by different restaurants and fast-food chains.
          </p>
          <button onClick={login} className="hero-cta-button">Join Now</button>
        </div>
        <div className="hero-image-container">
          <img src="/bg.jpg" alt="Loyalty Program Illustration" className="hero-image" />
        </div>
      </main>

      <footer className="main-footer">
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
