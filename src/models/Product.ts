// src/models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  material: string;
  color: string[];
  occasion: string[];
  images: string[];
  stock: number;
  sku: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  ratings: { user: mongoose.Types.ObjectId; rating: number; review: string; createdAt: Date }[];
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        'Silk Sarees', 'Cotton Sarees', 'Georgette Sarees', 'Chiffon Sarees',
        'Banarasi Sarees', 'Kanjivaram Sarees', 'Designer Sarees',
        'Party Wear', 'Casual Wear', 'Bridal Sarees',
      ],
    },
    material: { type: String, required: true },
    color: [{ type: String }],
    occasion: [{ type: String }],
    images: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    ratings: [RatingSchema],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.pre('save', function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = sum / this.ratings.length;
    this.totalReviews = this.ratings.length;
  }
  next();
});

// Auto-generate slug
ProductSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, active: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ featured: 1 });

export const Product = mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
