import type { Chain } from "../types";
export default {
  "chain": "ETH",
  "chainId": 324,
  "explorers": [
    {
      "name": "zkSync Era Block Explorer",
      "url": "https://explorer.zksync.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRkhUD6J3B9WhT4hEWLrcFVTrBhx3CQgNC783aJsrwxSN",
        "width": 512,
        "height": 512,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRkhUD6J3B9WhT4hEWLrcFVTrBhx3CQgNC783aJsrwxSN",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://zksync.io/",
  "name": "zkSync Era Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 324,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.zksync.io/"
      }
    ]
  },
  "rpc": [
    "https://zksync-era.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://324.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.era.zksync.io"
  ],
  "shortName": "zksync",
  "slug": "zksync-era",
  "testnet": false
} as const satisfies Chain;