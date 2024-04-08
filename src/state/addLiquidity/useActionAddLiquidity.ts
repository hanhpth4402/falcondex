import {useDispatch} from "react-redux";
import {field} from "@/state/swap/actionSwap";
import {
    changeAmount,
    selectCurrency,
    changeDeadlineTransaction,
    changeSlippageTolerance
} from "@/state/addLiquidity/actionAddLiquidity";
import {useCallback} from "react";

const useActionAddLiquidity = () => {
    const dispatch = useDispatch();
    const handleSelectToken = useCallback((field: field, currencyId: string) => {
        dispatch(selectCurrency({field, currencyId}))
    }, [dispatch]);

    const handleChangeAmount = useCallback((field: field, value: string) => {
        dispatch(changeAmount({field, value}))
    }, [dispatch]);

    const handleChangeSlippageTolerance = useCallback((value: string) => {
        dispatch(changeSlippageTolerance({
            value
        }))
    }, [dispatch]);

    const handleChangeDeadlineTransaction = useCallback((value: number) => {
        dispatch(changeDeadlineTransaction({
            value
        }))
    }, [dispatch]);

    return {handleSelectToken, handleChangeAmount, handleChangeSlippageTolerance, handleChangeDeadlineTransaction}
};

export default useActionAddLiquidity;
