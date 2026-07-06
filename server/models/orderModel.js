import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  amount: { type: Number, required: true },
  address: { type: String, required: true },
  status: { type: String, default: "Order Placed" },
  paymentType: { type: String, required: true },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
