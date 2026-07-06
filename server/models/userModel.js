import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isSeller: { type: Boolean, default: false },
  cartData: { type: Object, default: {} },
  addresses: { type: Array, default: [] }
}, { minimize: false, timestamps: true });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
