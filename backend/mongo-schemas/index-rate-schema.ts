import * as mongoose from 'mongoose';

interface IndexRateInterface {
  INDEX_NUM: number;
  rate: number;
}

const indexRateSchema = new mongoose.Schema({
  INDEX_NUM: {
    type: Number,
    unique: true,
    required: true
  },
  rate: {
    type: Number,
    default: 0
  }
});

export default mongoose.model<IndexRateInterface & mongoose.Document>('index-rate', indexRateSchema);
