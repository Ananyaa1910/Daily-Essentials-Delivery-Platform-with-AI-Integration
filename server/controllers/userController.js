import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import userModel from '../models/userModel.js';

// Helper to generate JWT
const createToken = (id, extra = {}) => {
  return jwt.sign({ id, ...extra }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      isSeller: false,
      cartData: {},
      addresses: []
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    // Save token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    // Check for configured Seller account
    if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
      const token = createToken('seller_id', { email, isSeller: true });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        success: true,
        message: "Seller Login successful",
        token,
        user: {
          id: 'seller_id',
          name: "Seller Account",
          email,
          isSeller: true
        }
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Address
export const addAddress = async (req, res) => {
  try {
    const { userId, firstName, lastName, email, street, city, state, zipcode, country, phone } = req.body;

    if (!firstName || !street || !city || !state || !zipcode || !country || !phone) {
      return res.status(400).json({ success: false, message: "Missing address fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newAddress = {
      _id: new mongoose.Types.ObjectId().toString(),
      userId,
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipcode: Number(zipcode),
      country,
      phone
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(200).json({ success: true, message: "Address added successfully", addresses: user.addresses });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Addresses
export const getAddresses = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
