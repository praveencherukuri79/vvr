import * as express from 'express';
import { CustomRequest, CustomResponse } from 'backend/models/expressTypes';
import IndexRateService from 'backend/services/index-rate.service';
import { attachCurrentUser, checkRole } from 'backend/express-router/express-middleware/middleware';

const app = express();

app.get('/rate/all', attachCurrentUser, async (req: CustomRequest, res: CustomResponse) => {
  try {
    const service = new IndexRateService();
    const data = await service.getRates();
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error getting rates data', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.get('/rate/:index', attachCurrentUser, async (req: CustomRequest, res: CustomResponse) => {
  try {
    const index: string = req.params.index;
    const service = new IndexRateService();
    const data = await service.getRate(parseInt(index));
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error getting rate data', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/rate/save', attachCurrentUser, checkRole('admin'), async (req: CustomRequest, res: CustomResponse) => {
  try {
    const body: { INDEX_NUM: number, rate: number } = req.body;

    const service = new IndexRateService();
    const data = await service.saveRate(body);
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error saving rate ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/rate/save/override', attachCurrentUser, checkRole('admin'), async (req: CustomRequest, res: CustomResponse) => {
  try {
    const body: [{ INDEX_NUM: number, rate: number }] = req.body;

    const service = new IndexRateService();
    const data = await service.saveRates(body);
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error saving rate as new collection ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

export default app;
