import type { Chain } from "../src/types";
export default {
  "chainId": 7171,
  "chain": "Bitrock",
  "name": "Bitrock Mainnet",
  "rpc": [
    "https://bitrock.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.bit-rock.io"
  ],
  "slug": "bitrock",
  "icon": {
    "url": "ipfs://QmfXZCAh3HWS2bJroUStN9TieL4QA9QArMotie3X4pwBfj",
    "width": 72,
    "height": 72,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BITROCK",
    "symbol": "BROCK",
    "decimals": 18
  },
  "infoURL": "https://bit-rock.io",
  "shortName": "bitrock",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bitrock Explorer",
      "url": "https://scan.bit-rock.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;