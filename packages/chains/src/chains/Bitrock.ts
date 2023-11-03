import type { Chain } from "../types";
export default {
  "chain": "Bitrock",
  "chainId": 7171,
  "explorers": [
    {
      "name": "Bitrock Explorer",
      "url": "https://explorer.bit-rock.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfXZCAh3HWS2bJroUStN9TieL4QA9QArMotie3X4pwBfj",
    "width": 72,
    "height": 72,
    "format": "svg"
  },
  "infoURL": "https://bit-rock.io",
  "name": "Bitrock Mainnet",
  "nativeCurrency": {
    "name": "BITROCK",
    "symbol": "BROCK",
    "decimals": 18
  },
  "networkId": 7171,
  "rpc": [
    "https://bitrock.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7171.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.bit-rock.io",
    "https://brockrpc.io"
  ],
  "shortName": "bitrock",
  "slug": "bitrock",
  "testnet": false
} as const satisfies Chain;