import type { Chain } from "../src/types";
export default {
  "chain": "Imversed",
  "chainId": 5555555,
  "explorers": [
    {
      "name": "Imversed Cosmos Explorer (Big Dipper)",
      "url": "https://tex-c.imversed.com",
      "standard": "none"
    },
    {
      "name": "Imversed EVM explorer (Blockscout)",
      "url": "https://txe.imversed.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmYwvmJZ1bgTdiZUKXk4SifTpTj286CkZjMCshUyJuBFH1",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://imversed.com",
  "name": "Imversed Mainnet",
  "nativeCurrency": {
    "name": "Imversed Token",
    "symbol": "IMV",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://imversed.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.imversed.network",
    "https://ws-jsonrpc.imversed.network"
  ],
  "shortName": "imversed",
  "slug": "imversed",
  "testnet": false
} as const satisfies Chain;