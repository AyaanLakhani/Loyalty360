import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Coupon from './coupon.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/xchange360', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  userId: String,
  wallet: String,
  email: String,
  phoneNumber: String,      // Ensure consistency with schema and frontend
  linkedAccounts: Object,
  firstName: String,         // Added first name
  lastName: String,          // Added last name
  profileImage: String,       // Added profile image

  coupons: [
    {
      company: String,
      title: String,
      description: String,
      code: String,
      expires: String,
      redeemed: { type: Boolean, default: false }
    }
  ],

  points: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

app.post('/api/users', async (req, res) => {
  const { userId, wallet, email, phoneNumber, linkedAccounts } = req.body;

  try {
    const existing = await User.findOne({ userId });

    if (existing) {
      existing.wallet = wallet;
      existing.email = email;
      existing.phoneNumber = phoneNumber;   // Ensure consistent field naming
      existing.linkedAccounts = linkedAccounts;
      await existing.save();
    } else {
      await User.create({
        userId,
        wallet,
        email,
        phoneNumber,
        linkedAccounts,
        firstName: "",     // Initialize with empty string
        lastName: "",
        profileImage: ""
      });
    }

    res.status(200).send('User saved/updated');
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).send('Server error');
  }
});

// ✅ GET route to fetch user by ID
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ userId: id });

    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).send('Server error');
  }
});

// ✅ PUT route to update first name, last name, and profile image
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, profileImage } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: id },
      { firstName, lastName, profileImage },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
});


app.get('/api/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (err) {
    console.error("Error fetching coupons:", err);
    res.status(500).send("Server error");
  }
});

app.post('/api/users/:id/coupons', async (req, res) => {
  const { id } = req.params;
  const coupon = req.body;

  try {
    const user = await User.findOne({ userId: id });
    if (!user) return res.status(404).send('User not found');

    // Check if this coupon is already added
    const alreadyAdded = user.coupons?.some(c => c.code === coupon.code);
    if (alreadyAdded) return res.status(409).send('Coupon already added');

    user.coupons.push({ ...coupon, redeemed: false });
    await user.save();

    res.status(200).send('Coupon added to profile');
  } catch (err) {
    console.error('Error adding coupon:', err);
    res.status(500).send('Server error');
  }
});

app.delete('/api/users/:userId/coupons/:code', async (req, res) => {
  const { userId, code } = req.params;

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).send('User not found');

    user.coupons = user.coupons.filter(coupon => coupon.code !== code);
    await user.save();

    res.send('Coupon removed');
  } catch (err) {
    console.error('Error removing coupon:', err);
    res.status(500).send('Server error');
  }
});

app.put('/api/users/:userId/coupons/:code/redeem', async (req, res) => {
  const { userId, code } = req.params;

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).send("User not found");

    const coupon = user.coupons.find(c => c.code === code);
    if (!coupon) return res.status(404).send("Coupon not found");
    if (coupon.redeemed) return res.status(400).send("Already redeemed");

    coupon.redeemed = true;
    await user.save();

    res.send("Coupon redeemed");
  } catch (err) {
    console.error("Error redeeming coupon:", err);
    res.status(500).send("Server error");
  }
});


app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
