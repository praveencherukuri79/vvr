import * as express from 'express';
import { CustomRequest, CustomResponse } from 'backend/models/expressTypes';
import MstcDataService from 'backend/services/mstc-data.service';
import { IMstc } from '@app/interface/mstc';
import { attachCurrentUser, checkRole } from 'backend/express-router/express-middleware/middleware';

const app = express();

app.get('/mstc/:reportName', attachCurrentUser, async (req: CustomRequest, res: CustomResponse) => {
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

app.get('/mstcReportNames', attachCurrentUser, async (req: CustomRequest, res: CustomResponse) => {
  try {
    const mstcDataInstance = new MstcDataService();
    const data = await mstcDataInstance.getMstcReportNames();
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error getting mstc report names list', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.get('/mstcReportList', attachCurrentUser, async (req: CustomRequest, res: CustomResponse) => {
  try {
    const mstcDataInstance = new MstcDataService();
    const data = await mstcDataInstance.getMstcReportList();
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error getting mstc report list', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/mstc/save', attachCurrentUser, checkRole('admin'), async (req: CustomRequest, res: CustomResponse) => {
  try {
    const reportName: string = req.body.reportName;
    const reportData: Array<IMstc> = req.body.reportData;
    const isFirstBatch: boolean = req.body.isFirstBatch;
    const mstcDataInstance = new MstcDataService();

    const data = await mstcDataInstance.saveMstc(reportName, reportData, isFirstBatch);

    return res.status(200).send(data);
  } catch (e) {
    console.log('Error saving mstc report ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/mstc/deleteReport', attachCurrentUser, checkRole('admin'), async (req: CustomRequest, res: CustomResponse) => {
  try {
    const id: string = req.body._id;
    const mstcDataInstance = new MstcDataService();
    const data = await mstcDataInstance.deleteMstc(id);
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error deleting mstc report ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

export default app;
