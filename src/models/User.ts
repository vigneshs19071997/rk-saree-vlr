// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: {
    _id?: string;
    label: string;
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
  }[];
  favourites: mongoose.Types.ObjectId[];
  emailVerified: boolean;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const AddressSchema = new Schema({
  label: { type: String, default: 'Home' },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: String,
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: [AddressSchema],
    favourites: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
