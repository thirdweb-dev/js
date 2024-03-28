import type { Chain } from "../src/types";
export default {
  "chain": "Bitrock",
  "chainId": 7771,
  "explorers": [
    {
      "name": "Bitrock Testnet Explorer",
      "url": "https://testnetscan.bit-rock.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.bit-rock.io"
  ],
  "icon": {
    "url": "ipfs://QmfXZCAh3HWS2bJroUStN9TieL4QA9QArMotie3X4pwBfj",
    "width": 72,
    "height": 72,
    "format": "svg"
  },
  "infoURL": "https://bit-rock.io",
  "name": "Bitrock Testnet",
  "nativeCurrency": {
    "name": "BITROCK",
    "symbol": "BROCK",
    "decimals": 18
  },
  "networkId": 7771,
  "rpc": [
    "https://7771.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bit-rock.io"
  ],
  "shortName": "tbitrock",
  "slip44": 1,
  "slug": "bitrock-testnet",
  "testnet": true
} as const satisfies Chain;