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
  "networkId": 513,
  "rpc": [
    "https://513.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.acuteangle.com"
  ],
  "shortName": "aact",
  "slip44": 1,
  "slug": "double-a-chain-testnet",
  "testnet": true
} as const satisfies Chain;