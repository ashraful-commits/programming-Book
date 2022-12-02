import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      trim: true,
    },
    book: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
    },
    cell: {
      type: String,
    },
    password: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'SignUp',
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'SignUp',
    },
    photo: {
      type: String,
      trim: true,
    },
    gallery: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

//===========================export model

export const userModel = mongoose.model('SignUp', userSchema);
