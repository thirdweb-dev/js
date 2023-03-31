import type { Chain } from "../src/types";
export default {
  "name": "HashKey Chain Testnet",
  "chain": "HashKey",
  "rpc": [
    "https://hashkey-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.hashkeychain/rpc"
  ],
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
  "chainId": 230315,
  "networkId": 230315,
  "icon": {
    "url": "ipfs://QmNU11AqYB2htrrSyBSP9ct7bPtuZTP7Hrz21PrEcB9nYE",
    "width": 1440,
    "height": 448,
    "format": "png"
  },
  "explorers": [
    {
      "name": "HashKey Chain Testnet Explorer",
      "url": "https://testnet.hashkeyscan.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "hashkey-chain-testnet"
} as const satisfies Chain;