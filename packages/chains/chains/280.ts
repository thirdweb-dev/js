import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 280,
  "explorers": [
    {
      "name": "zkSync Era Block Explorer",
      "url": "https://goerli.explorer.zksync.io",
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
  "name": "zkSync Era Goerli Testnet (deprecated)",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 280,
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
    "https://280.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.era.zksync.dev"
  ],
  "shortName": "zksync-goerli",
  "slip44": 1,
  "slug": "zksync-era-goerli-testnet-deprecated",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;