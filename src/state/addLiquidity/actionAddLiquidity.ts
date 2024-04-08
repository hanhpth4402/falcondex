import {createAction} from "@reduxjs/toolkit";
import {field} from "@/state/swap/actionSwap";

export const selectCurrency = createAction<{field: field, currencyId: string}>('addLiquidity/selectCurrency');
export const changeAmount = createAction<{field: field, value: string}>('addLiquidity/changeAmount');
export const changeSlippageTolerance = createAction<{value: string}>('addLiquidity/changeSlippageTolerance');
export const changeDeadlineTransaction = createAction<{value: number}>('addLiquidity/changeDeadlineTransaction')

