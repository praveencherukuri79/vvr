import * as express from 'express';
import { CustomRequest, CustomResponse } from 'backend/models/expressTypes';
import HeaderFooterService from 'backend/services/header-footer.service';
import { attachCurrentUser, checkRole } from 'backend/express-router/express-middleware/middleware';

const app = express();

app.get('/header-footer', attachCurrentUser, async (req: CustomRequest, res: CustomResponse) => {
  try {
    const service = new HeaderFooterService();
    const data = await service.getData();
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error getting header footer data', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/header-footer/save', attachCurrentUser, checkRole('admin'), async (req: CustomRequest, res: CustomResponse) => {
  try {
    const name: string = req.body.name;
    const header: string = req.body.header;
    const footer: string = req.body.footer;

    const service = new HeaderFooterService();
    const data = await service.saveData(name, header, footer);
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error saving mstc report ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

export default app;
