import type { Chain } from "../src/types";
export default {
  "name": "WEMIX Kanvas Sepolia",
  "title": "WEMIX Kanvas Testnet Sepolia",
  "chainId": 2357,
  "shortName": "kanvas-aqua",
  "chain": "ETH",
  "networkId": 2357,
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "rpc": [
    "https://wemix-kanvas-sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.aqua.wemixkanvas.io"
  ],
  "faucets": [],
  "infoURL": "https://wemixkanvas.io",
  "icon": {
    "url": "ipfs://QmVcVxsHsVg5BMii3EJ1MUSnLBZkQicpjmXjSmW66bCEUF",
    "width": 320,
    "height": 320,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.aqua.wemixkanvas.io",
      "icon": {
        "url": "ipfs://QmVcVxsHsVg5BMii3EJ1MUSnLBZkQicpjmXjSmW66bCEUF",
        "width": 320,
        "height": 320,
        "format": "svg"
      },
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://wemixkanvas.io/bridge"
      }
    ]
  },
  "testnet": true,
  "slug": "wemix-kanvas-sepolia"
} as const satisfies Chain;