import mongoose from 'mongoose';

//==================== create mongodb connection

export const MDBConnection = () => {
  try {
    mongoose.connect(process.env.MONGO_SEVER);
    console.log(`MongoDB connection Successfully Done!`.bgGreen);
  } catch (error) {
    console.log(error.message);
  }
};
