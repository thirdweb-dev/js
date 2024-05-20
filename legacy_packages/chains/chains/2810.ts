import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 2810,
  "explorers": [
    {
      "name": "Morph Holesky Testnet Explorer",
      "url": "https://explorer-holesky.morphl2.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://morphl2.io",
  "name": "Morph Holesky",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2810,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge-holesky.morphl2.io"
      }
    ]
  },
  "rpc": [
    "https://2810.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-quicknode-holesky.morphl2.io",
    "wss://rpc-quicknode-holesky.morphl2.io",
    "https://rpc-holesky.morphl2.io"
  ],
  "shortName": "hmorph",
  "slip44": 1,
  "slug": "morph-holesky",
  "testnet": true,
  "title": "Morph Holesky Testnet"
} as const satisfies Chain;