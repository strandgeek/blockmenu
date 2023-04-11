export const generateMetamaskDeeplink = (url: string) => {
  const urlWithoutProtocol = url.replace(/(^\w+:|^)\/\//, '');
  return `https://metamask.app.link/dapp/${urlWithoutProtocol}`;
}
