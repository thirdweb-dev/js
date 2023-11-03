import type { Chain } from "../types";
export default {
  "chain": "Imversed",
  "chainId": 5555555,
  "explorers": [
    {
      "name": "Imversed EVM explorer (Blockscout)",
      "url": "https://txe.imversed.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYwvmJZ1bgTdiZUKXk4SifTpTj286CkZjMCshUyJuBFH1",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    },
    {
      "name": "Imversed Cosmos Explorer (Big Dipper)",
      "url": "https://tex-c.imversed.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmYwvmJZ1bgTdiZUKXk4SifTpTj286CkZjMCshUyJuBFH1",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [],
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
  "networkId": 5555555,
  "rpc": [
    "https://imversed.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5555555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.imversed.network",
    "https://ws-jsonrpc.imversed.network"
  ],
  "shortName": "imversed",
  "slug": "imversed",
  "testnet": false
} as const satisfies Chain;