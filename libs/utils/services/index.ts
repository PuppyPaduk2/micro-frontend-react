import axios from "axios";
import { useEffect } from "react";
import io, { Socket } from 'socket.io-client';

export const getConfig = (payload) => {
  const { baseUrl = "", serviceKey } = payload;
  const url = serviceKey
    ? `${baseUrl}/api/services/config/${serviceKey}`
    : `${baseUrl}/api/services/config`;

  return axios.get(url);
};

export const getState = (payload) => {
  const { baseUrl = "", serviceKey } = payload;
  const url = serviceKey
    ? `${baseUrl}/api/services/state/${serviceKey}`
    : `${baseUrl}/api/services/state`;

  return axios.get(url);
};

export const getSocket = (baseUrl = "") => {
  return io("/", { path: `${baseUrl}/socket`, autoConnect: false });
};

export const useSocketConnect = (socket: typeof Socket) => {
  useEffect(() => {
    if (socket.disconnect) socket.connect();
  }, [socket]);
};

export const useSocketEvent = (socket, eventName, callback) => {
  useEffect(() => {
    const _callback = callback;

    socket.on(eventName, _callback);

    return () => {
      socket.off(eventName, _callback);
    };
  }, [socket, eventName, callback]);

  return socket;
};
