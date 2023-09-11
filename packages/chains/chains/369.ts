import type { Chain } from "../src/types";
export default {
  "name": "PulseChain",
  "shortName": "pls",
  "chain": "PLS",
  "chainId": 369,
  "networkId": 369,
  "infoURL": "https://pulsechain.com/",
  "rpc": [
    "https://pulsechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pulsechain.com",
    "wss://rpc.pulsechain.com",
    "https://pulsechain.publicnode.com",
    "wss://pulsechain.publicnode.com"
  ],
  "slip44": 60,
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "ens": {
    "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  "status": "active",
  "nativeCurrency": {
    "name": "Pulse",
    "symbol": "PLS",
    "decimals": 18
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.pulsechain.com",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    },
    {
      "name": "otterscan",
      "url": "https://otter.pulsechain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "pulsechain"
} as const satisfies Chain;