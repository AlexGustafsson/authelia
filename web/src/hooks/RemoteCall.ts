import { useState, useCallback, DependencyList } from "react";

type PromisifiedFunction<Ret> = (...args: any) => Promise<Ret>

/*
 * This hook is primarily used to run long running tasks that client can track progress of.
 */
export function useLongRunningTask<Ret>(fn: PromisifiedFunction<Ret>, deps: DependencyList)
    : [Ret | undefined, PromisifiedFunction<void>, boolean, Error | undefined] {
    const [data, setData] = useState(undefined as Ret | undefined);
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState(undefined as Error | undefined);

    const fnCallback = useCallback(fn, deps);

    const triggerCallback = useCallback(async () => {
        try {
            setInProgress(true);
            const res = await fnCallback();
            setInProgress(false);
            setData(res);
        } catch (err) {
            console.error(err);
            setError(err);
        }
    }, [setInProgress, setError, fnCallback]);

    return [
        data,
        triggerCallback,
        inProgress,
        error,
    ]
}