import type { Chain } from "../src/types";
export default {
  "chain": "ORL",
  "chainId": 3031,
  "explorers": [
    {
      "name": "Orlando (ORL) Explorer",
      "url": "https://orlscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmNsuuBBTHErnuFDcdyzaY8CKoVJtobsLJx2WQjaPjcp7g",
    "width": 512,
    "height": 528,
    "format": "png"
  },
  "infoURL": "https://orlchain.com",
  "name": "Orlando Chain",
  "nativeCurrency": {
    "name": "Orlando",
    "symbol": "ORL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://orlando-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.orlchain.com"
  ],
  "shortName": "ORL",
  "slug": "orlando-chain",
  "testnet": true
} as const satisfies Chain;