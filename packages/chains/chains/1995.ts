import type { Chain } from "../src/types";
export default {
  "chainId": 1995,
  "chain": "edeXa TestNetwork",
  "name": "edeXa Testnet",
  "rpc": [
    "https://edexa-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.edexa.com/rpc",
    "https://io-dataseed1.testnet.edexa.io-market.com/rpc"
  ],
  "slug": "edexa-testnet",
  "icon": {
    "url": "ipfs://QmSgvmLpRsCiu2ySqyceA5xN4nwi7URJRNEZLffwEKXdoR",
    "width": 1028,
    "height": 1042,
    "format": "png"
  },
  "faucets": [
    "https://faucet.edexa.com/"
  ],
  "nativeCurrency": {
    "name": "EDEXA",
    "symbol": "EDX",
    "decimals": 18
  },
  "infoURL": "https://edexa.com/",
  "shortName": "edx",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "edexa-testnet",
      "url": "https://explorer.testnet.edexa.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;