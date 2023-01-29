import * as mongoose from 'mongoose';

interface UserInterface {
  email: string;
  phone: string;
  password: string;
  name: string;
  adminApproved?: boolean;
  role?: string;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  adminApproved: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'user', // Possible values: user | admin 
  }

}, { collection: 'user_auth' })

export default mongoose.model<UserInterface & mongoose.Document>('user_auth', UserSchema)