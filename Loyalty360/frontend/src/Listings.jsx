import React, { useState } from "react";
import giftCards from "./giftCards.json";
import "./Listings.css";

const Listings = () => {
  // Token balance (later will come from wallet or smart contract)
  const [tokenBalance] = useState(760); // Mocked for now

  return (
    <div className="container">
      {/* Token Balance Banner */}
      <div className="balance-banner">
        <span>🪙 Your Token Balance: </span>
        <strong>{tokenBalance} Tokens</strong>
      </div>

      <h2 className="title">🎁 Gift Cards</h2>

      <div className="grid">
        {giftCards.map((card) => (
          <div key={card.id} className="card">
            <img
              className="card-logo"
              src={card.image}
              alt={`${card.name} gift card`}
            />
            <p className="card-title">{card.name}</p>
            <p className="card-description">{card.description}</p>
            <p className="card-token-cost">💰 {card.tokenCost} Tokens</p>
            <button className="card-btn" disabled>
              🔒 Redeem (Coming Soon)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listings;
