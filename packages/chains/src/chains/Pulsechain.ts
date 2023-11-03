import type { Chain } from "../types";
export default {
  "chain": "PLS",
  "chainId": 369,
  "ens": {
    "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.pulsechain.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    },
    {
      "name": "otterscan",
      "url": "https://otter.pulsechain.com",
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
  "infoURL": "https://pulsechain.com/",
  "name": "PulseChain",
  "nativeCurrency": {
    "name": "Pulse",
    "symbol": "PLS",
    "decimals": 18
  },
  "networkId": 369,
  "rpc": [
    "https://pulsechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://369.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pulsechain.com",
    "wss://rpc.pulsechain.com",
    "https://pulsechain.publicnode.com",
    "wss://pulsechain.publicnode.com",
    "https://rpc-pulsechain.g4mm4.io",
    "wss://rpc-pulsechain.g4mm4.io"
  ],
  "shortName": "pls",
  "slip44": 60,
  "slug": "pulsechain",
  "status": "active",
  "testnet": false
} as const satisfies Chain;