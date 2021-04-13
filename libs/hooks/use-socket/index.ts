import { createSocket } from 'libs/socket';
import { useMemo } from 'react';

export const useSocket = (base: string, path: string) => {
  return useMemo(() => createSocket(base, path), [base, path]);
};