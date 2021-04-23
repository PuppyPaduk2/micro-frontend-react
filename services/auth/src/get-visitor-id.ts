import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getVisitorId = () => {
  return FingerprintJS.load().then(({ get }) => get()).then(({ visitorId }) => visitorId);
};
