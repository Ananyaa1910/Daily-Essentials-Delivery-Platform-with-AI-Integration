import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: [String], required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  image: { type: [String], required: true },
  inStock: { type: Boolean, default: true },
  stock: { type: Number, default: 10 },
  weight: { type: String, default: "N/A" }
}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model('product', productSchema);
export default productModel;
