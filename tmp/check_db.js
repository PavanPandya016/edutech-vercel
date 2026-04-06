const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const { User } = require('../backend/models');

async function checkUserPhone() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({ email: 'admin@edutech.com' });
    console.log('Users found:', users.length);
    if (users.length > 0) {
      const user = users[0];
      console.log('User found:', {
        id: user._id,
        email: user.email,
        phone: user.phone,
        mobile: user.mobile,
        mobileNumber: user.mobileNumber,
        phoneNumber: user.phoneNumber
      });
    } else {
      console.log('User admin@edutech.com not found');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkUserPhone();
