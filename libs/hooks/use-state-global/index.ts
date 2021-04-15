import { useCallback, useEffect, useMemo, useState } from "react";
import Emittery from 'emittery';

type SetStateAction<S> = S | ((prevState: S) => S);

type Cell<T> = {
  emitter: Emittery;
  value: T;
};

type Space = Record<string, Cell<any>>;

const spaces: Record<string, Space> = {
  __global: {},
};

const SET_VALUE = "set-state";

export const useStateGlobal = <T>(
  initialValue: T,
  key: string,
  namespace?: string
): [T, (value: SetStateAction<T>) => void] => {
  const cell = useCell(initialValue, key, namespace);
  const [value, _setValue] = useState<T>(cell.value);

  const setState = useCallback((value: SetStateAction<T>) => {
    cell.emitter.emit(SET_VALUE, value);
  }, [cell]);

  useEffect(() => {
    const handler = (value: SetStateAction<T>) => _setValue(value);

    cell.emitter.on(SET_VALUE, handler);

    return () => {
      cell.emitter.off(SET_VALUE, handler);
    }
  }, [cell]);

  useEffect(() => {
    cell.value = value;
  }, [value]);

  return [value, setState];
};

const useCell = <T>(
  initialValue: T,
  key: string,
  namespace?: string
): Cell<T> => {
  const space = useSpace(namespace);

  return useMemo(() => {
    space[key] = space[key] || { emitter: new Emittery(), value: initialValue };
    return space[key];
  }, [space]);
};

const useSpace = (namespace: string = "__global"): Space => {
  return useMemo(() => {
    spaces[namespace] = spaces[namespace] ?? {};
    return spaces[namespace]
  }, [namespace]);
};

// export const useGlobalState = <T>(
//   initialValue: T,
//   key: string,
//   namespace?: string = "__global"
// ): [T, (value: SetStateAction<T>) => void] => {
//   const [state, _setState] = useState<T>(cache[key]?.state || initialValue);

//   const setState = useCallback((value: SetStateAction<T>) => {
//     cache[key].emitter.emit("set-state", value);
//   }, []);

//   useEffect(() => {
//     if (!cache[key]) {
//       cache[key] = { emitter: new Emittery(), state: initialValue };
//     }

//     const handler = (value: SetStateAction<T>) => {
//       _setState(value);
//     };

//     cache[key].emitter.on("set-state", handler);

//     return () => {
//       cache[key].emitter.off("set-state", handler);
//     };
//   }, [key]);

//   useEffect(() => {
//     if (cache[key]) cache[key].state = state;
//   }, [state]);

//   return [state, setState];
// };
