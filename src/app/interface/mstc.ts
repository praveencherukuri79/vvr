export interface IMstc {
    _id?: string;
    rate?: number;
    canteenRate?: number;
    totalAmount?: number;
    canteenTotalAmount?: number;
    profit?: number;
    NAME?: string;
    YEAR_MONTH?: string;
    GROUP_CODE?: number;
    INDEX_NUM?: number;
    ITEM_DESC?:  string;
    STACK_NUM?: number;
    CASE_PACK?: number;
    QTY_OPENING_CASES?: number;
    QTY_OPENING_UNITS?: number;
    QTY_RECEIVED_CASES?: number;
    QTY_RECEIVED_UNITS?: number;
    QTY_SOLD_CASES?: number;
    QTY_SOLD_UNITS?: number;
    QTY_OTHER_ISS_CASES?: number;
    QTY_OTHER_ISS_UNITS?: number;
    QTY_STOCKED_CASES?: number;
    QTY_STOCKED_UNITS?: number;
    QTY_DENIED_CASES?: number;
    QTY_DENIED_UNITS?: number;
}