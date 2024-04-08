import {field} from "@/state/swap/actionSwap";
import {createReducer} from "@reduxjs/toolkit";
import {
    changeAmount,
    selectCurrency,
    changeSlippageTolerance,
    changeDeadlineTransaction,
} from "@/state/addLiquidity/actionAddLiquidity";

const InitialAddLiquidityState: {
    independentField: field,
    [field.INPUT]: {
        currencyId: string,
        value: string,
    },
    [field.OUTPUT]: {
        currencyId: string,
        value: string,
    },
    slippageTolerance: number,
    deadline: number;
} = {
    independentField: field.INPUT,
    [field.INPUT]: {
        currencyId: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
        value: '0',
    },
    [field.OUTPUT]: {
        currencyId: "0x2DAcbf2E82e5F78564DB1C5005bEC00A34DFBC6F",
        value: '0'
    },
    slippageTolerance: 0,
    deadline: 0,
};

const AddLiquidityReducer = createReducer(InitialAddLiquidityState, builder => {
    builder.addCase(selectCurrency, (state, {payload: {currencyId, field}}) => {
        return {
            ...state,
            [field]: {
                currencyId: currencyId,
            }
        }
    }).addCase(changeAmount, (state, {payload: {value, field}})=> {
        const oldState = {...state};
        return {
            ...state,
            independentField: field,
            [field]: {
                ...oldState[field],
                value,
            },
        }
    }).addCase(changeSlippageTolerance, (state, {payload: {value}}) => {
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
    }).addCase(changeDeadlineTransaction, (state, {payload: {value}}) => {
        return {
            ...state,
            deadline: value
        }
    });
});

export default AddLiquidityReducer;
