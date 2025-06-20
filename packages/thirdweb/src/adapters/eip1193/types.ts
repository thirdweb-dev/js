// loose interface on purpose to adapt to any version of viem, ethers, ox, web3js, etc
export type EIP1193Provider = {
  // biome-ignore lint/suspicious/noExplicitAny: allowed here
  on(event: any, listener: (params: any) => any): void;
  // biome-ignore lint/suspicious/noExplicitAny: allowed here
  removeListener(event: any, listener: (params: any) => any): void;
  // biome-ignore lint/suspicious/noExplicitAny: allowed here
  request: (params: any) => Promise<any>;
};
