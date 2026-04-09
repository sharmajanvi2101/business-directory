import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const promoteUser = async () => {
  const email = process.argv[2];
  if (!email) {
    console.error('Please provide an email: node promote.js <email>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Success! ${email} is now an admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

promoteUser();
