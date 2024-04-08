import {
    changeAmount,
    changeDeadlineTransaction,
    changeSlipageTolerance,
    field,
    selectCurrency,
    switchCurrency
} from "@/state/swap/actionSwap";
import {useDispatch} from "react-redux";
import {useCallback} from "react";
import BigNumber from "bignumber.js";

const useActionSwap = () => {
    const dispatch = useDispatch();
    const handleSelectToken = useCallback((field: field, currencyId: string) => {
        dispatch(selectCurrency({
            field,
            currencyId
        }));
    }, [dispatch]);

    const handleChangeAmount = useCallback((field: field, value: string) => {
        dispatch(changeAmount({
            field,
            value
        }));
    }, [dispatch]);

    const handleChangeSlippageTolerance = useCallback((value: string) => {
        dispatch(changeSlipageTolerance({
            value
        }))
    }, [dispatch]);

    const handleSwitchCurrency = useCallback((newAmountValue: string) => {
        dispatch(switchCurrency({
            newAmountValue,
        }))
    }, [dispatch]);

    const handleChangeDeadlineTransaction = useCallback((value: number) => {
        dispatch(changeDeadlineTransaction({
            value
        }))
    }, [dispatch]);

    return {handleSwitchCurrency, handleSelectToken, handleChangeAmount, handleChangeSlippageTolerance, handleChangeDeadlineTransaction};
}

export default useActionSwap;
