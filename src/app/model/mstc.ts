import { IMstc } from '../interface/mstc';

export class Mstc implements IMstc {
  NAME: string;
  YEAR_MONTH: string;
  GROUP_CODE: number;
  INDEX_NUM: number;
  ITEM_DESC: string;
  STACK_NUM: number;
  CASE_PACK: number;
  QTY_OPENING_CASES: number;
  QTY_OPENING_UNITS: number;
  QTY_RECEIVED_CASES: number;
  QTY_RECEIVED_UNITS: number;
  QTY_SOLD_CASES: number;
  QTY_SOLD_UNITS: number;
  QTY_OTHER_ISS_CASES: number;
  QTY_OTHER_ISS_UNITS: number;
  QTY_STOCKED_CASES: number;
  QTY_STOCKED_UNITS: number;
  QTY_DENIED_CASES: number;
  QTY_DENIED_UNITS: number;

  constructor(MstcObject: IMstc) {
    this.NAME = MstcObject.NAME;
    this.YEAR_MONTH = MstcObject.YEAR_MONTH;
    this.GROUP_CODE = MstcObject.GROUP_CODE;
    this.INDEX_NUM = MstcObject.INDEX_NUM;
    this.ITEM_DESC = MstcObject.ITEM_DESC;
    this.STACK_NUM = MstcObject.STACK_NUM;
    this.CASE_PACK = MstcObject.CASE_PACK;
    this.QTY_OPENING_CASES = MstcObject.QTY_OPENING_CASES;
    this.QTY_OPENING_UNITS = MstcObject.QTY_OPENING_UNITS;
    this.QTY_RECEIVED_CASES = MstcObject.QTY_RECEIVED_CASES;
    this.QTY_RECEIVED_UNITS = MstcObject.QTY_RECEIVED_UNITS;
    this.QTY_SOLD_CASES = MstcObject.QTY_SOLD_CASES;
    this.QTY_SOLD_UNITS = MstcObject.QTY_SOLD_UNITS;
    this.QTY_OTHER_ISS_CASES = MstcObject.QTY_OTHER_ISS_CASES;
    this.QTY_OTHER_ISS_UNITS = MstcObject.QTY_OTHER_ISS_UNITS;
    this.QTY_STOCKED_CASES = MstcObject.QTY_STOCKED_CASES;
    this.QTY_STOCKED_UNITS = MstcObject.QTY_STOCKED_UNITS;
    this.QTY_DENIED_CASES = MstcObject.QTY_DENIED_CASES;
    this.QTY_DENIED_UNITS = MstcObject.QTY_DENIED_UNITS;
  }
}


  // stcked == closed
  // sale == Sold