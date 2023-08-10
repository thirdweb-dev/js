import type { Chain } from "../src/types";
export default {
  "name": "Bitrock Testnet",
  "chain": "Bitrock",
  "icon": {
    "url": "ipfs://QmfXZCAh3HWS2bJroUStN9TieL4QA9QArMotie3X4pwBfj",
    "width": 72,
    "height": 72,
    "format": "svg"
  },
  "rpc": [
    "https://bitrock-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bit-rock.io"
  ],
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
  "chainId": 7771,
  "networkId": 7771,
  "explorers": [
    {
      "name": "Bitrock Testnet Explorer",
      "url": "https://testnetscan.bit-rock.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "bitrock-testnet"
} as const satisfies Chain;