const cache: Record<string, any> = {};

export const add = (key: string, value: any) => {
  cache[key] = value;
  return cache;
};
