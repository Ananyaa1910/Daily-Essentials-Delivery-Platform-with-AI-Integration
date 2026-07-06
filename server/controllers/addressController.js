import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;
    
    // Support either nested address or flat req.body fields
    const data = address || req.body;

    if (!data.firstName || !data.street || !data.city || !data.state || !data.zipcode || !data.country || !data.phone) {
      return res.status(400).json({ success: false, message: "Missing address fields" });
    }

    const newAddress = await Address.create({
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      street: data.street,
      city: data.city,
      state: data.state,
      zipcode: Number(data.zipcode),
      country: data.country,
      phone: data.phone
    });

    res.json({
      success: true,
      message: "Address added successfully",
      address: newAddress
    });

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// Get Address : /api/address/get
export const getAddress = async (req, res) => {
  try {
    const { userId } = req.body;

    const addresses = await Address.find({ userId });

    res.json({
      success: true,
      addresses
    });

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};