import type { Chain } from "../src/types";
export default {
  "chainId": 7771,
  "chain": "Bitrock",
  "name": "Bitrock Testnet",
  "rpc": [
    "https://bitrock-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bit-rock.io"
  ],
  "slug": "bitrock-testnet",
  "icon": {
    "url": "ipfs://QmfXZCAh3HWS2bJroUStN9TieL4QA9QArMotie3X4pwBfj",
    "width": 72,
    "height": 72,
    "format": "svg"
  },
  "faucets": [
    "https://faucet.bit-rock.io"
  ],
  "nativeCurrency": {
    "name": "BITROCK",
    "symbol": "BROCK",
    "decimals": 18
  },
  "infoURL": "https://bit-rock.io",
  "shortName": "tbitrock",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bitrock Testnet Explorer",
      "url": "https://testnetscan.bit-rock.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;