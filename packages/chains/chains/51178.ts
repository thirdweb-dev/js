import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 51178,
  "explorers": [
    {
      "name": "LumozTestnetInfo",
      "url": "https://lumoz.info",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmZnE2ygPL2ZGuzHGvFCHmrqxwdurrhz3K1yPnwLzKbgay",
        "width": 401,
        "height": 400,
        "format": "png"
      }
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
  "icon": {
    "url": "ipfs://QmZnE2ygPL2ZGuzHGvFCHmrqxwdurrhz3K1yPnwLzKbgay",
    "width": 401,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://lumoz.org",
  "name": "Lumoz Testnet Alpha",
  "nativeCurrency": {
    "name": "Lumoz Test Token",
    "symbol": "MOZ",
    "decimals": 18
  },
  "networkId": 51178,
  "rpc": [
    "https://51178.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alpha-us-http-geth.lumoz.org",
    "https://alpha-hk-http-geth.lumoz.org"
  ],
  "shortName": "Lumoz-Testnet",
  "slip44": 1,
  "slug": "lumoz-testnet-alpha",
  "testnet": true
} as const satisfies Chain;