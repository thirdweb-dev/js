import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 280,
  "explorers": [
    {
      "name": "zkSync Era Block Explorer",
      "url": "https://goerli.explorer.zksync.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://goerli.portal.zksync.io/faucet"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmRkhUD6J3B9WhT4hEWLrcFVTrBhx3CQgNC783aJsrwxSN",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://era.zksync.io/docs/",
  "name": "zkSync Era Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://zksync-era-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.era.zksync.dev"
  ],
  "shortName": "zksync-goerli",
  "slug": "zksync-era-testnet",
  "testnet": true
} as const satisfies Chain;