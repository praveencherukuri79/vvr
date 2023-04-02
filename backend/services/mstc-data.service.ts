import { IMstc } from '@app/interface/mstc';
import MstcReportModel from '../mongo-schemas/mstc';

export default class MstcDataService {
  constructor() {}

  async saveMstc(reportName: string, mstcData: Array<IMstc>, isFirstBatch: boolean): Promise<any> {
    try {
      let updateData;
      if (isFirstBatch) {
        updateData = {
          reportName: reportName,
          reportData: mstcData
        };
      } else {
        updateData = {
          $push: { reportData: mstcData }
        };
      }

      await MstcReportModel.findOneAndUpdate({ reportName: reportName }, updateData, {
        upsert: true,
        new: true,
        runValidators: true
      });
      
      console.log('save mstc is success');
      //return this.returnData(data);
      return {response: 'success'};
    } catch (e) {
      console.log('failed to save mstc');
      throw new Error('failed to save mstc');
    }
  }

  // async appendMstc(reportName: string, mstcData: Array<IMstc>): Promise<any> {
  //   try {
  //     const data = await MstcReportModel.findOneAndUpdate(
  //       { reportName: reportName },
  //       {
  //         $push: {reportData : mstcData}
  //       },
  //       { upsert: true, new: true, runValidators: true }
  //     );
  //     console.log('save mstc is success');
  //     return this.returnData(data);
  //   } catch (e) {
  //     console.log('failed to save mstc');
  //     throw new Error('failed to save mstc');
  //   }
  // }

  async getMstc(reportName: string): Promise<any> {
    try {
      const report = await MstcReportModel.findOne({ reportName }).lean();
      return report;
    } catch (e) {
      throw new Error('failed to retrive mstc');
    }
  }

  async getMstcReportNames(): Promise<any> {
    try {
      const report = await MstcReportModel.find({}, { reportName: 1, _id: 0 });
      const reportNames = [];
      report.forEach((item) => {
        reportNames.push(item.reportName);
      });
      return reportNames;
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
