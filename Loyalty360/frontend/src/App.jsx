// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Providers from './Providers';
import Homepage from './Homepage';
import Listings from './Listings';
import Profilepage from './Profilepage';
import Marketplace from './Marketplace';

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/profilepage" element={<Profilepage/>} />
            <Route path="/marketplace" element={<Marketplace/>} />
            {/* Add other routes if needed */}
          </Routes>
        </div>
      </BrowserRouter>
    </Providers>
  );
}
