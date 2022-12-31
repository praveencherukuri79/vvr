import { IMstc } from '@app/interface/mstc';
import MstcReportModel from '../mongo-schemas/mstc';

export default class MstcDataService {
  constructor() {}

  async saveMstc(reportName: string, mstcData: Array<IMstc>): Promise<any> {
    try {
      const data = await MstcReportModel.findOneAndUpdate(
        { reportName: reportName },
        {
          reportName: reportName,
          reportData: mstcData
        },
        { upsert: true, new: true, runValidators: true }
      );
      console.log('save mstc is success');
      return this.returnData(data);
    } catch (e) {
      console.log('failed to save mstc');
      throw new Error('failed to save mstc');
    }
  }

  async getMstc(reportName: string): Promise<any> {
    try {
      const report = await MstcReportModel.findOne({ reportName });
      return report;
    } catch (e) {
      throw new Error('failed to retrive mstc');
    }
  }

  returnData(mstcReport) {
    return {
      reportName: mstcReport.reportName,
      reportData: mstcReport.reportData
    };
  }
}
