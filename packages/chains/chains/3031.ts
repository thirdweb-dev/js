import type { Chain } from "../src/types";
export default {
  "chainId": 3031,
  "chain": "ORL",
  "name": "Orlando Chain",
  "rpc": [
    "https://orlando-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.orlchain.com"
  ],
  "slug": "orlando-chain",
  "icon": {
    "url": "ipfs://QmNsuuBBTHErnuFDcdyzaY8CKoVJtobsLJx2WQjaPjcp7g",
    "width": 512,
    "height": 528,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Orlando",
    "symbol": "ORL",
    "decimals": 18
  },
  "infoURL": "https://orlchain.com",
  "shortName": "ORL",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Orlando (ORL) Explorer",
      "url": "https://orlscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;