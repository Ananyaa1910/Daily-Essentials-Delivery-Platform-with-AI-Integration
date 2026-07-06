import Stripe from 'stripe';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// Place Order using Cash on Delivery (COD)
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!items || items.length === 0 || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing order details" });
    }

    // Prepare items for DB
    const dbItems = items.map(item => ({
      product: item._id,
      quantity: item.quantity
    }));

    const newOrder = new orderModel({
      userId,
      items: dbItems,
      amount,
      address,
      paymentType: "COD",
      isPaid: false
    });

    await newOrder.save();

    // Clear User Cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(201).json({ success: true, message: "Order placed successfully" });

  } catch (error) {
    console.error("Place Order (COD) Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Place Order using Stripe Online Payment
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const origin = req.headers.origin || "http://localhost:5173";

    if (!items || items.length === 0 || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing order details" });
    }

    // Save unpaid order in database
    const dbItems = items.map(item => ({
      product: item._id,
      quantity: item.quantity
    }));

    const newOrder = new orderModel({
      userId,
      items: dbItems,
      amount,
      address,
      paymentType: "Online",
      isPaid: false
    });

    await newOrder.save();

    // Prepare Stripe line items
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd', // standard USD matching frontend VITE_CURRENCY=$
        product_data: {
          name: item.name,
          description: `Category: ${item.category}`
        },
        unit_amount: Math.round(item.offerPrice * 100) // Stripe expects unit amount in cents
      },
      quantity: item.quantity
    }));

    // Add tax line item if applicable (2% tax)
    const taxAmount = Math.round(amount * 0.02 * 100);
    if (taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: "Tax (2%)",
            description: "Order Tax"
          },
          unit_amount: taxAmount
        },
        quantity: 1
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("Place Order (Stripe) Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Stripe Payment
export const verifyStripe = async (req, res) => {
  try {
    const { orderId, success, userId } = req.body;

    if (!orderId || success === undefined) {
      return res.status(400).json({ success: false, message: "Missing verification parameters" });
    }

    if (success === "true" || success === true) {
      // Mark order as paid
      await orderModel.findByIdAndUpdate(orderId, { isPaid: true });
      
      // Clear User Cart
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.status(200).json({ success: true, message: "Payment successful" });
    } else {
      // Delete unpaid order if checkout cancelled
      await orderModel.findByIdAndDelete(orderId);
      res.status(200).json({ success: false, message: "Payment failed/cancelled" });
    }

  } catch (error) {
    console.error("Verify Stripe Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch orders for a specific user
export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const orders = await orderModel.find({ userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });

  } catch (error) {
    console.error("User Orders Fetch Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all orders for seller dashboard
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
      .populate('items.product')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });

  } catch (error) {
    console.error("Seller Orders Fetch Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (Seller dashboard action)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Missing order ID or status" });
    }

    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Status updated successfully", order });

  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
