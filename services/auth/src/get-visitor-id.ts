import FingerprintJS from '@fingerprintjs/fingerprintjs';

const get = () => FingerprintJS.load().then(({ get }) => get());

export const getVisitorId = () => {
  return get().then(() => get()).then(({ visitorId }) => visitorId);
};
