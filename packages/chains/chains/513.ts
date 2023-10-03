import type { Chain } from "../src/types";
export default {
  "chain": "AAC",
  "chainId": 513,
  "explorers": [
    {
      "name": "aacscan-testnet",
      "url": "https://scan-testnet.acuteangle.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://scan-testnet.acuteangle.com/faucet"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmRUrz4dULaoaMpnqd8qXT7ehwz3aaqnYKY4ePsy7isGaF",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.acuteangle.com/",
  "name": "Double-A Chain Testnet",
  "nativeCurrency": {
    "name": "Acuteangle Native Token",
    "symbol": "AAC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://double-a-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.acuteangle.com"
  ],
  "shortName": "aact",
  "slug": "double-a-chain-testnet",
  "testnet": true
} as const satisfies Chain;