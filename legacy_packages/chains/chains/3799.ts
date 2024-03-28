import type { Chain } from "../src/types";
export default {
  "chain": "Tangle Testnet",
  "chainId": 3799,
  "explorers": [
    {
      "name": "ttntscan",
      "url": "https://testnet-explorer.tangle.tools",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.tangle.tools"
  ],
  "icon": {
    "url": "ipfs://QmbxMNBTeQgch8t9GpWdLiS2R3wPYCzVRaX5kCQ4o5QU3w",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "infoURL": "https://docs.tangle.tools",
  "name": "Tangle Testnet",
  "nativeCurrency": {
    "name": "Testnet Tangle Network Token",
    "symbol": "tTNT",
    "decimals": 18
  },
  "networkId": 3799,
  "rpc": [
    "https://3799.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.tangle.tools",
    "https://testnet-rpc-archive.tangle.tools",
    "wss://testnet-rpc.tangle.tools",
    "wss://testnet-rpc-archive.tangle.tools"
  ],
  "shortName": "tTangle",
  "slug": "tangle-testnet",
  "testnet": true
} as const satisfies Chain;