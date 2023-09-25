import type { Chain } from "../src/types";
export default {
  "chainId": 8181,
  "chain": "tBOC",
  "name": "Testnet BeOne Chain",
  "rpc": [
    "https://testnet-beone-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pre-boc1.beonechain.com"
  ],
  "slug": "testnet-beone-chain",
  "icon": {
    "url": "ipfs://QmbVLQnaMDu86bPyKgCvTGhFBeYwjr15hQnrCcsp1EkAGL",
    "width": 500,
    "height": 500,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Testnet BeOne Chain",
      "url": "https://testnet.beonescan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;