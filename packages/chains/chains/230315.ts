import type { Chain } from "../src/types";
export default {
  "chainId": 230315,
  "chain": "HashKey",
  "name": "HashKey Chain Testnet",
  "rpc": [
    "https://hashkey-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.hashkeychain/rpc"
  ],
  "slug": "hashkey-chain-testnet",
  "icon": {
    "url": "ipfs://QmNU11AqYB2htrrSyBSP9ct7bPtuZTP7Hrz21PrEcB9nYE",
    "width": 1440,
    "height": 448,
    "format": "png"
  },
  "faucets": [
    "https://testnet.hashkeychain/faucet"
  ],
  "nativeCurrency": {
    "name": "HashKey Token",
    "symbol": "tHSK",
    "decimals": 18
  },
  "infoURL": "https://www.hashkey.com",
  "shortName": "hsktest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "HashKey Chain Testnet Explorer",
      "url": "https://testnet.hashkeyscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;