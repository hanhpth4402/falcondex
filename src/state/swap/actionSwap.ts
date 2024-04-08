import {createAction} from '@reduxjs/toolkit';
import BigNumber from "bignumber.js";

export enum field {
    INPUT = "INPUT",
    OUTPUT = "OUTPUT",
}

export const selectCurrency = createAction<{field: field, currencyId: string}>('swap/selectCurrency');
export const switchCurrency = createAction<{newAmountValue: string}>('swap/switchCurrency');
export const changeAmount = createAction<{field: field, value: string}>('swap/changeAmount');

export const changeSlipageTolerance = createAction<{value: string}>('swap/changeSlipageTolerance')
export const changeDeadlineTransaction = createAction<{value: number}>('swap/changeDeadlineTransaction')
