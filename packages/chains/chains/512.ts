import type { Chain } from "../src/types";
export default {
  "chainId": 512,
  "chain": "AAC",
  "name": "Double-A Chain Mainnet",
  "rpc": [
    "https://double-a-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.acuteangle.com"
  ],
  "slug": "double-a-chain",
  "icon": {
    "url": "ipfs://QmRUrz4dULaoaMpnqd8qXT7ehwz3aaqnYKY4ePsy7isGaF",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Acuteangle Native Token",
    "symbol": "AAC",
    "decimals": 18
  },
  "infoURL": "https://www.acuteangle.com/",
  "shortName": "aac",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "aacscan",
      "url": "https://scan.acuteangle.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;