import {combineReducers, configureStore, createReducer} from "@reduxjs/toolkit";
import SwapReducer from "@/state/swap/reducerSwap";
import AddLiquidityReducer from "@/state/addLiquidity/reducerAddLiquidity";

const store = configureStore({
    reducer: combineReducers({
        swap: SwapReducer,
        addLiquidity: AddLiquidityReducer
    })
});

export default store;
