import * as mongoose from 'mongoose';

interface UserInterface {
  header: string;
  footer: string;
  name: string;
}

const headerFooterSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true,
  },

  footer: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  }

})

export default mongoose.model<UserInterface & mongoose.Document>('header_footer', headerFooterSchema);