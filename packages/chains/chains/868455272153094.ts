import type { Chain } from "../src/types";
export default {
  "chain": "GWT",
  "chainId": 868455272153094,
  "explorers": [
    {
      "name": "GWScan Block Explorer",
      "url": "https://v1.aggron.gwscan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://homura.github.io/light-godwoken"
  ],
  "infoURL": "https://www.nervos.org",
  "name": "Godwoken Testnet (V1)",
  "nativeCurrency": {
    "name": "CKB",
    "symbol": "CKB",
    "decimals": 8
  },
  "networkId": 868455272153094,
  "rpc": [
    "https://godwoken-testnet-v1-gw-testnet-v1-deprecated.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://868455272153094.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://godwoken-testnet-web3-v1-rpc.ckbapp.dev"
  ],
  "shortName": "gw-testnet-v1-deprecated",
  "slip44": 1,
  "slug": "godwoken-testnet-v1-gw-testnet-v1-deprecated",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;