import React, { useEffect, useState } from "react";
import "./Marketplace.css";

const companies = [
  { name: "Nike", description: "Shop Nike's latest footwear and gear.", affiliateLink: "https://www.nike.com" },
  { name: "Adidas", description: "Get the best deals from Adidas.", affiliateLink: "https://www.adidas.com" },
  { name: "Puma", description: "Discover Puma's sportswear.", affiliateLink: "https://us.puma.com" },
  { name: "Ralph Lauren", description: "Luxury fashion from Ralph Lauren.", affiliateLink: "https://www.ralphlauren.com" },
  { name: "Levi Strauss", description: "Denim classics and more from Levi's.", affiliateLink: "https://www.levi.com" },
  { name: "Under Armour", description: "Shop Under Armour's performance gear.", affiliateLink: "https://www.underarmour.com" },
  { name: "Crocs", description: "Stylish and comfortable Crocs for everyone.", affiliateLink: "https://www.crocs.com" },
  { name: "Skechers", description: "Discover Skechers' comfortable footwear.", affiliateLink: "https://www.skechers.com" },
];

const Marketplace = () => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const fetchLogos = async () => {
      const fetched = await Promise.all(
        companies.map(async (company) => {
          try {
            const res = await fetch(
              `https://api.api-ninjas.com/v1/logo?name=${company.name}`,
              {
                headers: {
                  "X-Api-Key": "DtxjSv85eQCuYyrbPSAaGw==XUtOJg1xJzeeTxKa",
                },
              }
            );
            const data = await res.json();
            return {
              ...company,
              logo: data[0]?.image || "https://via.placeholder.com/150",
            };
          } catch (err) {
            console.error("Error fetching logo:", err);
            return {
              ...company,
              logo: "https://via.placeholder.com/150",
            };
          }
        })
      );
      setLogos(fetched);
    };

    fetchLogos();
  }, []);

  const handleCredit = (companyName) => {
    alert(`✅ You've been credited for a purchase at ${companyName}!`);
    // TODO: Integrate with smart contract or backend to mint tokens
  };

  return (
    <div className="marketplace-container">
      <h1 className="marketplace-heading">Discover Deals and Shop to Earn Rewards</h1>
      <p className="marketplace-subtext">
        Browse your favorite brands, shop, and earn loyalty tokens for future rewards!
      </p>

      <div className="marketplace-grid">
        {logos.map((company, index) => (
          <div key={index} className="marketplace-card">
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="company-logo"
            />
            <p className="company-description">{company.description}</p>
            <a
              href={company.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shop-now-link"
            >
              Shop Now
            </a>
            <button
              className="credit-button"
              onClick={() => handleCredit(company.name)}
            >
              ✅ Credit / Made Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
