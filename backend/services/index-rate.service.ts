import IndexRateModel from '../mongo-schemas/index-rate-schema';

export default class IndexRateService {
  constructor() {}

  async saveRate(rate: { INDEX_NUM: number, rate: number, canteenRate: number }): Promise<any> {
    try {
      const data = await IndexRateModel.findOneAndUpdate({ INDEX_NUM: rate.INDEX_NUM }, rate, {
        upsert: true,
        new: true,
        runValidators: true
      });
      console.log('save rate by index num is success');
      return data;
    } catch (e) {
      console.log('failed to save rate by index num', e);
      throw new Error('failed to save rate by index num');
    }
  }

  async saveRates(rates: Array<{ INDEX_NUM: number, rate: number, canteenRate: number }>): Promise<any> {
    try {
      await IndexRateModel.deleteMany({});
      const data = await IndexRateModel.create(rates);

      console.log('save rates is success');
      return data;
    } catch (e) {
      console.log('failed to save rates', e);
      throw new Error('failed to save rates');
    }
  }

  async getRates(): Promise<any> {
    try {
      const data = await IndexRateModel.find();
      return data;
    } catch (e) {
      console.log('failed to get rates', e);
      throw new Error('failed to retrive rates data');
    }
  }

  async getRate(index: number): Promise<any> {
    try {
      const data = await IndexRateModel.findOne({ INDEX_NUM: index });
      return data;
    } catch (e) {
      console.log('failed to get rate by index', e);
      throw new Error('failed to retrive rate by index num');
    }
  }
}
