import type { Chain } from "../src/types";
export default {
  "chain": "HashKey",
  "chainId": 230315,
  "explorers": [
    {
      "name": "HashKey Chain Testnet Explorer",
      "url": "https://testnet.hashkeyscan.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://testnet.hashkeychain/faucet"
  ],
  "icon": {
    "url": "ipfs://QmNU11AqYB2htrrSyBSP9ct7bPtuZTP7Hrz21PrEcB9nYE",
    "width": 1440,
    "height": 448,
    "format": "png"
  },
  "infoURL": "https://www.hashkey.com",
  "name": "HashKey Chain Testnet",
  "nativeCurrency": {
    "name": "HashKey Token",
    "symbol": "tHSK",
    "decimals": 18
  },
  "networkId": 230315,
  "rpc": [
    "https://hashkey-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://230315.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.hashkeychain/rpc"
  ],
  "shortName": "hsktest",
  "slug": "hashkey-chain-testnet",
  "testnet": true
} as const satisfies Chain;