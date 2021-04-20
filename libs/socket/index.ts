import io, { Socket } from 'socket.io-client';

const sockets: Map<string, typeof Socket> = new Map();

export const createSocket = (base: string, path: string) => {
  const key = `${base}__${path}`;
  const socket = sockets.get(key) || io(base, { path });

  if (!sockets.has(key)) {
    sockets.set(key, socket);
  }

  return socket;
};
