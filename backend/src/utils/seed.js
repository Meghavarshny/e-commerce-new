require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Demo credentials from README
    const users = [
      {
        name: 'Demo Buyer',
        email: 'buyer@example.com',
        password: 'password123',
        role: 'buyer'
      },
      {
        name: 'Demo Seller',
        email: 'seller@example.com',
        password: 'password123',
        role: 'seller'
      }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists. Updating password...`);
        existingUser.password = await bcrypt.hash(userData.password, 10);
        await existingUser.save();
      } else {
        console.log(`Creating user ${userData.email}...`);
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({
          ...userData,
          password: hashedPassword
        });
      }
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedUsers();
