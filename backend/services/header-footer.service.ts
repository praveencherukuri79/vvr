import HeaderFooterModel from '../mongo-schemas/header-footer';

export default class HeaderFooterService {
  constructor() {}

  async saveData(name: string, header: string, footer: string): Promise<any> {
    try {
      const data = await HeaderFooterModel.findOneAndUpdate(
        { name: name },
        {
          name,
          header,
          footer
        },
        { upsert: true, new: true, runValidators: true }
      );
      console.log('save headre-footer is success');
      return data;
    } catch (e) {
      console.log('failed to save headre-footer');
      throw new Error('failed to save headre-footer data');
    }
  }

  async getData(): Promise<any> {
    try {
      const data = await HeaderFooterModel.find();
      return data;
    } catch (e) {
      throw new Error('failed to retrive headre-footer data');
    }
  }
}
