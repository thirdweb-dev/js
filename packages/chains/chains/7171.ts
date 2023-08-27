import type { Chain } from "../src/types";
export default {
  "name": "Bitrock Mainnet",
  "chain": "Bitrock",
  "icon": {
    "url": "ipfs://QmfXZCAh3HWS2bJroUStN9TieL4QA9QArMotie3X4pwBfj",
    "width": 72,
    "height": 72,
    "format": "svg"
  },
  "rpc": [
    "https://bitrock.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.bit-rock.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BITROCK",
    "symbol": "BROCK",
    "decimals": 18
  },
  "infoURL": "https://bit-rock.io",
  "shortName": "bitrock",
  "chainId": 7171,
  "networkId": 7171,
  "explorers": [
    {
      "name": "Bitrock Explorer",
      "url": "https://scan.bit-rock.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bitrock"
} as const satisfies Chain;