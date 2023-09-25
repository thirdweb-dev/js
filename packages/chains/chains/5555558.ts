import type { Chain } from "../src/types";
export default {
  "chainId": 5555558,
  "chain": "Imversed",
  "name": "Imversed Testnet",
  "rpc": [
    "https://imversed-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc-test.imversed.network",
    "https://ws-jsonrpc-test.imversed.network"
  ],
  "slug": "imversed-testnet",
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
  "shortName": "imversed-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Imversed Cosmos Explorer (Big Dipper)",
      "url": "https://tex-t.imversed.com",
      "standard": "none"
    },
    {
      "name": "Imversed EVM Explorer (Blockscout)",
      "url": "https://txe-test.imversed.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;