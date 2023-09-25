import type { Chain } from "../src/types";
export default {
  "chainId": 324,
  "chain": "ETH",
  "name": "zkSync Era Mainnet",
  "rpc": [
    "https://zksync-era.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.era.zksync.io"
  ],
  "slug": "zksync-era",
  "icon": {
    "url": "ipfs://QmRkhUD6J3B9WhT4hEWLrcFVTrBhx3CQgNC783aJsrwxSN",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zksync.io/",
  "shortName": "zksync",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "zkSync Era Block Explorer",
      "url": "https://explorer.zksync.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;