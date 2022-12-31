import * as express from 'express';
import { CustomRequest, CustomResponse } from 'backend/models/expressTypes';
import MstcDataService from 'backend/services/mstc-data.service';
import { IMstc } from '@app/interface/mstc';

const app = express();

app.get('/mstc/:reportName', async (req: CustomRequest, res: CustomResponse) => {
  try {
    const reportName: string = req.params.reportName;
    const mstcDataInstance = new MstcDataService();
    const data = await mstcDataInstance.getMstc(reportName.toLowerCase());
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error getting mstc report ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/mstc/save', async (req: CustomRequest, res: CustomResponse) => {
  try {
    const reportName: string = req.body.reportName;
    const reportData: Array<IMstc> = req.body.reportData;
    const mstcDataInstance = new MstcDataService();
    const data = await mstcDataInstance.saveMstc(reportName, reportData);
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error saving mstc report ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

export default app;
