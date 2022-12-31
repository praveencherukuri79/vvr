import { IMstc } from '@app/interface/mstc';
import * as mongoose from 'mongoose';

interface MstcReportInterface {
    reportName: string;
    reportData: Array<IMstc>;
  }

const mstcSchema = new mongoose.Schema({
  NAME: {
    type: String
  },
  YEAR_MONTH: {
    type: String
  },
  GROUP_CODE: {
    type: Number
  },
  INDEX_NUM: {
    type: Number
  },
  ITEM_DESC: {
    type: String
  },
  STACK_NUM: {
    type: Number
  },
  CASE_PACK: {
    type: Number
  },
  QTY_OPENING_CASES: {
    type: Number
  },
  QTY_OPENING_UNITS: {
    type: Number
  },
  QTY_RECEIVED_CASES: {
    type: Number
  },
  QTY_RECEIVED_UNITS: {
    type: Number
  },
  QTY_SOLD_CASES: {
    type: Number
  },
  QTY_SOLD_UNITS: {
    type: Number
  },
  QTY_OTHER_ISS_CASES: {
    type: Number
  },
  QTY_OTHER_ISS_UNITS: {
    type: Number
  },
  QTY_STOCKED_CASES: {
    type: Number
  },
  QTY_STOCKED_UNITS: {
    type: Number
  },
  QTY_DENIED_CASES: {
    type: Number
  },
  QTY_DENIED_UNITS: {
    type: Number
  }
});

const mstcReportSchema = new mongoose.Schema({
  reportName: {
    type: String,
    unique: true,
    lowercase: true,
  },
  reportData: {
    type: [mstcSchema]
  }
});

// mstcReportSchema.pre('findOneAndUpdate', function(next) {
//   this.setOptions({runValidators: true});
//   //this.options.runValidators = true;
//   next();
// });

export default mongoose.model<MstcReportInterface & mongoose.Document>('mstcReport', mstcReportSchema);
