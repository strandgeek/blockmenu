declare global {
  interface Window {
    tronWeb: any;
    tronLink: any;
  }
}

declare module 'tronweb';

export default global;
