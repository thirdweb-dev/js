import type { Chain } from "../src/types";
export default {
  "chain": "MaalChain Testnet",
  "chainId": 7860,
  "explorers": [
    {
      "name": "maalscan testnet",
      "url": "https://testnet.maalscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet-testnet.maalscan.io/"
  ],
  "icon": {
    "url": "ipfs://bafkreiexfqfe2x4impvwhra3xxa5eb25gv25zi3kkaoatdnld7wbxdzf2a",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.maalchain.com/",
  "name": "MaalChain Testnet",
  "nativeCurrency": {
    "name": "MAAL",
    "symbol": "MAAL",
    "decimals": 18
  },
  "networkId": 7860,
  "rpc": [
    "https://maalchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7860.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.maalscan.io/",
    "https://rpc-bntest.maalscan.io/"
  ],
  "shortName": "maal-test",
  "slug": "maalchain-testnet",
  "testnet": true
} as const satisfies Chain;