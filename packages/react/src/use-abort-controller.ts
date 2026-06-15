import { useCallback, useRef, useState } from "react";

export function useAbortController() {
  const controllerRef = useRef(new AbortController());
  const [version, setVersion] = useState(0);

  const reset = useCallback(() => {
    controllerRef.current = new AbortController();
    setVersion((value) => value + 1);
  }, []);

  const abort = useCallback(() => {
    controllerRef.current.abort();
    reset();
  }, [reset]);

  return {
    abort,
    reset,
    signal: controllerRef.current.signal,
    version,
  };
}

