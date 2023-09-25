import type { Chain } from "../src/types";
export default {
  "chainId": 280,
  "chain": "ETH",
  "name": "zkSync Era Testnet",
  "rpc": [
    "https://zksync-era-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.era.zksync.dev"
  ],
  "slug": "zksync-era-testnet",
  "icon": {
    "url": "ipfs://QmRkhUD6J3B9WhT4hEWLrcFVTrBhx3CQgNC783aJsrwxSN",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [
    "https://goerli.portal.zksync.io/faucet"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://era.zksync.io/docs/",
  "shortName": "zksync-goerli",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "zkSync Era Block Explorer",
      "url": "https://goerli.explorer.zksync.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;