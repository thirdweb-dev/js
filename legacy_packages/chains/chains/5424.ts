import type { Chain } from "../src/types";
export default {
  "chain": "edeXa Network",
  "chainId": 5424,
  "explorers": [
    {
      "name": "edexa-mainnet",
      "url": "https://explorer.edexa.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmSgvmLpRsCiu2ySqyceA5xN4nwi7URJRNEZLffwEKXdoR",
    "width": 1028,
    "height": 1042,
    "format": "png"
  },
  "infoURL": "https://edexa.network/",
  "name": "edeXa Mainnet",
  "nativeCurrency": {
    "name": "EDEXA",
    "symbol": "EDX",
    "decimals": 18
  },
  "networkId": 5424,
  "rpc": [
    "https://5424.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.edexa.network/rpc",
    "https://mainnet.edexa.com/rpc",
    "https://io-dataseed1.mainnet.edexa.io-market.com/rpc"
  ],
  "shortName": "edeXa",
  "slip44": 1,
  "slug": "edexa",
  "testnet": false
} as const satisfies Chain;