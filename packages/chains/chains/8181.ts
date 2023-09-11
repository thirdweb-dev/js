import type { Chain } from "../src/types";
export default {
  "name": "Testnet BeOne Chain",
  "chain": "tBOC",
  "rpc": [
    "https://testnet-beone-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pre-boc1.beonechain.com"
  ],
  "faucets": [
    "https://testnet.beonescan.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Testnet BeOne Chain",
    "symbol": "tBOC",
    "decimals": 18
  },
  "infoURL": "https://testnet.beonescan.com",
  "shortName": "tBOC",
  "chainId": 8181,
  "networkId": 8181,
  "icon": {
    "url": "ipfs://QmbVLQnaMDu86bPyKgCvTGhFBeYwjr15hQnrCcsp1EkAGL",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Testnet BeOne Chain",
      "url": "https://testnet.beonescan.com",
      "icon": {
        "url": "ipfs://QmbVLQnaMDu86bPyKgCvTGhFBeYwjr15hQnrCcsp1EkAGL",
        "width": 500,
        "height": 500,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "testnet-beone-chain"
} as const satisfies Chain;