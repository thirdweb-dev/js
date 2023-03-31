import type { Chain } from "../src/types";
export default {
  "name": "zkSync Era Testnet",
  "chain": "ETH",
  "rpc": [
    "https://zksync-era-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.era.zksync.dev"
  ],
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
  "chainId": 280,
  "networkId": 280,
  "icon": {
    "url": "ipfs://QmRkhUD6J3B9WhT4hEWLrcFVTrBhx3CQgNC783aJsrwxSN",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "zkSync Era Block Explorer",
      "url": "https://goerli.explorer.zksync.io",
      "icon": {
        "url": "ipfs://QmRkhUD6J3B9WhT4hEWLrcFVTrBhx3CQgNC783aJsrwxSN",
        "width": 512,
        "height": 512,
        "format": "svg"
      },
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://goerli.portal.zksync.io/bridge"
      }
    ]
  },
  "testnet": true,
  "slug": "zksync-era-testnet"
} as const satisfies Chain;