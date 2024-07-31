import type { Chain } from "../src/types";
export default {
  "chain": "BinaryChain",
  "chainId": 9876,
  "explorers": [
    {
      "name": "BinaryChain Testnet Explorer",
      "url": "https://explorer.testnet.binarychain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.testnet.binarychain.org"
  ],
  "icon": {
    "url": "ipfs://bafybeifb4vnpn3jv7cfdlne2dwhe6agdnpgmu46a7nbc5divjuyaznkyay",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://binarychain.org",
  "name": "BinaryChain Testnet",
  "nativeCurrency": {
    "name": "BINARY",
    "symbol": "BNRY",
    "decimals": 18
  },
  "networkId": 9876,
  "rpc": [
    "https://9876.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctestnet.binarychain.org"
  ],
  "shortName": "binarytestnet",
  "slug": "binarychain-testnet",
  "testnet": true
} as const satisfies Chain;