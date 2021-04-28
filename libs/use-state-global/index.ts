import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Emittery from 'emittery';
import { v4 as uuid } from "uuid";

export type SetStateAction<S> = S | ((prevState: S) => S);

type Cell<T> = {
  emitter: Emittery;
  value: T;
};

type Space = Record<string, Cell<any>>;

const spaces: Record<string, Space> = {
  __global: {},
};

const SET_VALUE = "set-state";

// TODO After unmounted not work setValue
export const useStateGlobal = <T>(
  initialValue: T,
  key?: string,
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
  key?: string,
  namespace?: string
): Cell<T> => {
  const { key: innerKey, isCustomKey } = useKey(key);
  const space = useSpace(namespace);

  useEffect(() => () => {
    if (isCustomKey) delete space[innerKey];
  }, [space, innerKey, isCustomKey])

  return useMemo(() => {
    space[innerKey] = space[innerKey] || { emitter: new Emittery(), value: initialValue };
    return space[innerKey];
  }, [space, innerKey]);
};

const useKey = (key?: string) => {
  const keyRef = useRef({
    key: key || uuid(),
    isCustomKey: typeof key !== "string",
  });
  return keyRef.current;
};

const useSpace = (namespace: string = "__global"): Space => {
  return useMemo(() => {
    spaces[namespace] = spaces[namespace] ?? {};
    return spaces[namespace]
  }, [namespace]);
};
