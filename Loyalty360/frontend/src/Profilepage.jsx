import React, { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { FaTrashAlt } from "react-icons/fa";
import "./Profile.css";

const API_BASE_URL = "http://localhost:5000";

const ProfilePage = () => {
  const { user, authenticated } = usePrivy();
  const userId = user?.id?.split(":").slice(0, 4).join(":");

  const [profileData, setProfileData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authenticated && userId) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/users/${userId}`);
          if (!res.ok) throw new Error("Failed to fetch user data");
          const data = await res.json();
          setProfileData(data);
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setProfileImage(data.profileImage || "/default-profile.png");
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };

    fetchUserProfile();
  }, [authenticated, userId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          profileImage,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updated = await response.json();
      setProfileData(updated);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleRemoveCoupon = async (couponCode) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}/coupons/${couponCode}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Coupon removed!");
        setProfileData((prev) => ({
          ...prev,
          coupons: prev.coupons.filter(c => c.code !== couponCode),
        }));
      } else {
        alert("Failed to remove coupon.");
      }
    } catch (err) {
      console.error("Error removing coupon:", err);
    }
  };

  const handleRedeemCoupon = async (couponCode) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}/coupons/${couponCode}/redeem`, {
        method: "PUT",
      });

      if (res.ok) {
        alert("🎉 Coupon redeemed!");
        setProfileData((prev) => ({
          ...prev,
          coupons: prev.coupons.map((c) =>
            c.code === couponCode ? { ...c, redeemed: true } : c
          ),
        }));
      } else {
        alert("Failed to redeem coupon.");
      }
    } catch (err) {
      console.error("Error redeeming coupon:", err);
    }
  };

  if (!authenticated || !profileData) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Profile Image Card */}
        <div className="profile-image-card">
          <label htmlFor="image-upload" className="image-upload-label">
            <img src={profileImage} alt="Profile" className="profile-pic" />
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
          <p className="image-note">Click to change photo</p>
        </div>

        {/* User Info Card */}
        <div className="profile-info-card">
          <h2 className="info-title">👤 Profile</h2>

          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter First Name"
            />
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter Last Name"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="text" value={profileData.email || "N/A"} disabled />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input type="text" value={profileData.phoneNumber || "N/A"} disabled />
          </div>

          <div className="form-group">
            <label>Wallet:</label>
            <input type="text" value={profileData.wallet || "N/A"} disabled />
          </div>

          <button onClick={handleSave} className="save-button">Save Profile</button>
        </div>
      </div>

      {/* Coupon Section */}
      <div className="coupon-container">
        <h3>Your Coupons</h3>
        {profileData.coupons?.length > 0 ? (
          profileData.coupons.map((coupon, index) => (
            <div className="coupon-card" key={index}>
              <div className="coupon-card-header">
                <button
                  className="remove-coupon"
                  onClick={() => handleRemoveCoupon(coupon.code)}
                  title="Remove Coupon"
                >
                  <FaTrashAlt />
                </button>
              </div>
              <h4>{coupon.title}</h4>
              <p>{coupon.description}</p>
              <p><strong>Company:</strong> {coupon.company}</p>
              <p><strong>Code:</strong> {coupon.code}</p>
              <p><strong>Expires:</strong> {coupon.expires}</p>
              <p style={{ color: coupon.redeemed ? "green" : "orange" }}>
                {coupon.redeemed ? "✅ Redeemed" : "🎟️ Unredeemed"}
              </p>
              {!coupon.redeemed && (
                <button
                  className="redeem-button"
                  onClick={() => handleRedeemCoupon(coupon.code)}
                >
                  🎁 Redeem
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="no-coupons-text">You haven’t added any coupons yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
