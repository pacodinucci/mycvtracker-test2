import { useCallback, useEffect, useMemo, useRef } from "react";

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};


export const useDebounce = (callback: Function, ms: number = 300) => {
  const ref = useRef<Function>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...agrs: any[]) => {
      ref.current?.(...agrs);
    };

    return debounce(func, ms);
  }, [ms]);

  return debouncedCallback;
};
