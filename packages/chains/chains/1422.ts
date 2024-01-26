import type { Chain } from "../src/types";
export default {
  "chain": "Polygon",
  "chainId": 1422,
  "explorers": [
    {
      "name": "Polygon zkEVM explorer",
      "url": "https://explorer.public.zkevm-test.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://polygon.technology/solutions/polygon-zkevm/",
  "name": "Polygon zkEVM Testnet Pre Audit-Upgraded",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1422,
  "rpc": [],
  "shortName": "testnet-zkEVM-mango-pre-audit-upgraded",
  "slip44": 1,
  "slug": "polygon-zkevm-testnet-pre-audit-upgraded",
  "status": "deprecated",
  "testnet": true,
  "title": "Polygon zkEVM Testnet Pre Audit-Upgraded"
} as const satisfies Chain;