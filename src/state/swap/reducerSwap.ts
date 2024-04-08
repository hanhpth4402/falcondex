import {createReducer} from "@reduxjs/toolkit";
import {
    changeAmount,
    changeDeadlineTransaction,
    changeSlipageTolerance,
    field,
    selectCurrency,
    switchCurrency
} from "@/state/swap/actionSwap";
import BigNumber from "bignumber.js";
import {Double} from "@solana/buffer-layout";

const InitialSwapState: {
    independentField: field;
    value: string;
    [field.INPUT]: {
        currencyId: string;
    };
    [field.OUTPUT]: {
        currencyId: string;
    };
    slippageTolerance: number;
    deadline: number;
} = {
    independentField: field.INPUT,
    value: '0',
    [field.INPUT]: {
        currencyId: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    },
    [field.OUTPUT]: {
        currencyId: '0x2DAcbf2E82e5F78564DB1C5005bEC00A34DFBC6F',
    },
    slippageTolerance: 0,
    deadline: 0,
};

const SwapReducer = createReducer(InitialSwapState, builder => {
    builder.addCase(selectCurrency, (state, { payload: { field, currencyId } }) => {
        return {
            ...state,
            [field]: {
                currencyId
            },
        }
    }).addCase(changeAmount, (state, {payload: {field, value}})=> {
        return {
            ...state,
            independentField: field,
            value
        }
    }).addCase(switchCurrency, (state, {payload: {newAmountValue}}) => {
        const newOutput = state[field.INPUT].currencyId;
        const newInput = state[field.OUTPUT].currencyId;
        return {
            ...state,
            [field.INPUT]: {
                currencyId: newInput,
            },
            [field.OUTPUT]: {
                currencyId: newOutput,
            },
            value: newAmountValue
        }
    }).addCase(changeSlipageTolerance, (state, {payload: {value}}) => {
        const newNum = Number(value);
        if (!newNum || newNum < 0) return {
            ...state,
            slippageTolerance: 0
        }
        if(newNum > 100) return {
            ...state,
            slippageTolerance: 100
        }
        return {
            ...state,
            slippageTolerance: newNum
        }
    }).addCase(changeDeadlineTransaction, (state, { payload: { value }}) => {
        return {
            ...state,
            deadline: value
        }
    })
});

export default SwapReducer;
