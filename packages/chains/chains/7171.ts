import type { Chain } from "../src/types";
export default {
  "chain": "Bitrock",
  "chainId": 7171,
  "explorers": [
    {
      "name": "Bitrock Explorer",
      "url": "https://scan.bit-rock.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
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
  "redFlags": [],
  "rpc": [
    "https://bitrock.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.bit-rock.io"
  ],
  "shortName": "bitrock",
  "slug": "bitrock",
  "testnet": false
} as const satisfies Chain;