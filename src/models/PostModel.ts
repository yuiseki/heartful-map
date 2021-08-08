import mongoose from 'mongoose';
import { IUserModel } from './UserModel';

interface IPost {
  title: string;
  body?: string;
  latitude?: number;
  longitude?: number;
  placeState?: string;
  placeCity?: string;
  address?: string;
  url?: string;
  imageUrl?: string;
  tel?: string;
  email?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  draft: boolean;
  confirmed: boolean;
  user: IUserModel;
  createdAt: string;
  updatedAt: string;
}

export interface IPostModel extends IPost, mongoose.Document {}

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    placeState: { type: String, default: null },
    placeCity: { type: String, default: null },
    address: { type: String, default: null },
    url: { type: String, default: null },
    imageUrl: { type: String, default: null },
    tel: { type: String, default: null },
    email: { type: String, default: null },
    twitter: { type: String, default: null },
    facebook: { type: String, default: null },
    instagram: { type: String, default: null },
    draft: { type: Boolean, default: true },
    confirmed: { type: Boolean, default: false },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'UserModel',
      default: null,
    },
  },
  { timestamps: true }
);

export const PostModel =
  mongoose.models.PostModel || mongoose.model<IPostModel>('PostModel', schema);
