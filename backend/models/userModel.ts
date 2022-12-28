import * as mongoose from 'mongoose';

interface UserInterface {
  email: string;
  password: string;
  name: string;
  role?: string;
}

const UserSchema = new mongoose.Schema({
  email: {
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
    type: String
  },

  role: {
    type: String,
    default: 'user', // Possible values: user | admin 
  }

}, { collection: 'user_auth' })

export default mongoose.model<UserInterface & mongoose.Document>('user_auth', UserSchema)