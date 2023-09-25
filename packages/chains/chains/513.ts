import type { Chain } from "../src/types";
export default {
  "chainId": 513,
  "chain": "AAC",
  "name": "Double-A Chain Testnet",
  "rpc": [
    "https://double-a-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.acuteangle.com"
  ],
  "slug": "double-a-chain-testnet",
  "icon": {
    "url": "ipfs://QmRUrz4dULaoaMpnqd8qXT7ehwz3aaqnYKY4ePsy7isGaF",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://scan-testnet.acuteangle.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Acuteangle Native Token",
    "symbol": "AAC",
    "decimals": 18
  },
  "infoURL": "https://www.acuteangle.com/",
  "shortName": "aact",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "aacscan-testnet",
      "url": "https://scan-testnet.acuteangle.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;