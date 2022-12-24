import { Mstc } from "../model/mstc";

export interface ISearchFilter {
  label: string;
  name: keyof Mstc;
  defaultValue: string;
  placeHolder: string;
  inputValue: string;
  matSelectDefaultValue: string | number;
  data: Array<number|string>;
}