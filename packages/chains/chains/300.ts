import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 300,
  "explorers": [
    {
      "name": "zkSync Block Explorer",
      "url": "https://sepolia.explorer.zksync.io",
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
  "name": "zkSync Sepolia Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 300,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.zksync.io/"
      }
    ]
  },
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://zksync-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://300.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.era.zksync.dev"
  ],
  "shortName": "zksync-sepolia",
  "slip44": 1,
  "slug": "zksync-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;