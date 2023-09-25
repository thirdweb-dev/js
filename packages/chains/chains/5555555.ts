import type { Chain } from "../src/types";
export default {
  "chainId": 5555555,
  "chain": "Imversed",
  "name": "Imversed Mainnet",
  "rpc": [
    "https://imversed.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.imversed.network",
    "https://ws-jsonrpc.imversed.network"
  ],
  "slug": "imversed",
  "icon": {
    "url": "ipfs://QmYwvmJZ1bgTdiZUKXk4SifTpTj286CkZjMCshUyJuBFH1",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Imversed Token",
    "symbol": "IMV",
    "decimals": 18
  },
  "infoURL": "https://imversed.com",
  "shortName": "imversed",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;