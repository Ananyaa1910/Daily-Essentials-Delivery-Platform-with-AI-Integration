import userModel from '../models/userModel.js';

// Add items to user cart
export const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    
    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    userData.cartData = cartData;
    // Mark modified for mixed/object types in Mongoose
    userData.markModified('cartData');
    await userData.save();

    res.status(200).json({ success: true, message: "Added to Cart", cartData });

  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart item quantity
export const updateCart = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    if (!itemId || quantity === undefined) {
      return res.status(400).json({ success: false, message: "Item ID and quantity are required" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (Number(quantity) <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = Number(quantity);
    }

    userData.cartData = cartData;
    userData.markModified('cartData');
    await userData.save();

    res.status(200).json({ success: true, message: "Cart Updated", cartData });

  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove items from user cart (decrement or delete)
export const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }
    }

    userData.cartData = cartData;
    userData.markModified('cartData');
    await userData.save();

    res.status(200).json({ success: true, message: "Removed from Cart", cartData });

  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch user cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, cartData: userData.cartData || {} });

  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
